# SosMed · Especificação de Backend v1.0 (documento de engenharia)

**Para quem:** qualquer engenheiro(a) contratado(a) executa por este documento, e o fundador (não-técnico) cobra por ele — cada tarefa tem critério de aceite verificável em 1 frase.
**Estado em 24/07/2026:** infraestrutura provisionada e VERIFICADA (checklist §7). O que resta está em §5 com código/contratos prontos.

---

## 1 · Arquitetura e armazenamento (decidido e no ar)

| Camada | Tecnologia | Identificação | Papel |
|---|---|---|---|
| Banco + Auth + Storage | **Supabase** (Postgres 15, região `sa-east-1` São Paulo) | projeto `sosmed` · ref `yaqphldowpshhrtvvfaq` · org `anvoiaxvckdhpkjieowa` | fonte da verdade de TODOS os dados; login; fotos |
| Funções serverless | **Vercel** (Node) | team `sosmedai` · projeto `sosmed` (`prj_d3YJdorgrqlGEdckJJ82Ov7VkX2C`) | IA (Lia/SOAP/Copiloto), webhooks de pagamento e WhatsApp |
| Frontend | GitHub Pages (hoje) → Vercel (quando quiser domínio próprio) | repo `drsostenescosta-rgb.github.io`, pasta `/sosmed` | páginas já conectadas ao backend |
| Cache offline | `localStorage` do navegador | chaves `farolApp_v1`, `sosmedSessao_v1` | espelho local; a nuvem manda |

**Proteção (implementada):** Row Level Security em todas as tabelas — usuário autenticado só lê/escreve `auth.uid() = profissional_id`; anônimo só lê perfis publicados e insere agendamento/avaliação(não-aprovada); tabelas financeiras só aceitam escrita via `service_role` (webhooks). Testado: INSERT anônimo indevido → 401. Dados sensíveis nunca passam pelo frontend sem sessão.

## 2 · Banco de dados (migrações JÁ APLICADAS — não recriar)

Migrações no Supabase: `schema_inicial_sosmed`, `console_estado_sync`, `monetizacao_e_auditoria`.
Tabelas (15): `profissionais` (1:1 auth.users, criada por trigger `handle_new_user` no signup) · `pacientes` · `consultas` · `lia_conversas` · `documentos` · `exames` · `lembretes` · `marketplace_perfis` · `marketplace_agendamentos` · `avaliacoes` · `console_estado` (sync JSONB) · `assinaturas` · `pagamentos_sinal` · `ia_logs`.
Ver colunas/policies: Dashboard → Database → Tables, ou `supabase db dump`.

## 3 · Variáveis de ambiente (Vercel → sosmed → Settings → Environment Variables)

| Nome | Valor | Quem fornece | Usada por |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys | **fundador** | lia, soap, copiloto |
| `SOSMED_MODEL` | `claude-sonnet-5` (default se ausente) | — | idem |
| `SUPABASE_URL` | `https://yaqphldowpshhrtvvfaq.supabase.co` | já conhecido | logs de IA, webhooks |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → `service_role` ⚠️ NUNCA no frontend | dashboard | idem |
| `MP_WEBHOOK_SECRET` / `ASAAS_WEBHOOK_TOKEN` | painel do gateway | **fundador** | webhook-pagamento |
| `META_WA_TOKEN` + `META_WA_VERIFY_TOKEN` + `META_WA_PHONE_ID` | Meta for Developers | **fundador** | webhook-whatsapp (§5.3) |

## 4 · Endpoints EM PRODUÇÃO (base `https://sosmed-sosmedai.vercel.app`)

Todos POST/JSON com CORS aberto; retornam `501` com instrução clara enquanto a env var correspondente não existir (comportamento intencional).

| Endpoint | Entrada | Saída | Regra crítica embutida |
|---|---|---|---|
| `/api/lia` | `{mensagens:[{role,content}], perfil:{nome,especialidade,valorConsulta,valorPlano}, horarios:[...], profissionalId}` | `{resposta, uso}` | prefixo `[TRANSFERIR]` em tema clínico; `[AGENDAR:i]` na escolha; nunca desconto; nunca orientação clínica |
| `/api/soap` | `{transcricao, profissional:{nome,registro}, profissionalId}` | `{soap, uso}` | fiel à transcrição, não inventa; assinatura do profissional no rodapé |
| `/api/copiloto` | `{transcricao, especialidade, profissionalId}` | `{copiloto:{temas,perguntas,alertas,hipoteses}, uso}` | JSON estrito; "apoio, decisão é do profissional" |
| `/api/webhook-pagamento` | evento do gateway | `{ok}` | escreve `pagamentos_sinal`/`assinaturas` só via service_role |

Todo uso de IA é logado em `ia_logs` (custo por profissional auditável).

## 5 · Backlog restante (ordem de execução, com aceite)

### 5.1 Ligar a IA (esforço: 1 hora, depende só das envs)
- [ ] Fundador: desligar **Deployment Protection** (Vercel → sosmed → Settings → Deployment Protection → Disabled) e criar `ANTHROPIC_API_KEY` + `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`; redeploy.
- [ ] Dev: no `app.html`, função `liaResponde` → se online, chamar `/api/lia` (fallback: regras locais atuais); botões SOAP/copiloto → `/api/soap` e `/api/copiloto` com mesmo fallback.
  **Aceite:** conversar "tenho dor no peito" no console → resposta da API com `[TRANSFERIR]`; `ia_logs` ganha 1 linha.

### 5.2 Pagamentos (Mercado Pago Assinaturas OU Asaas — decidir por taxa/PJ)
- [ ] Assinatura R$ 349: criar plano no gateway; checkout link na landing; webhook confirma → `assinaturas.status='ativa'`.
- [ ] Sinal Pix da consulta: ao agendar, `POST` cria cobrança Pix → link na conversa da Lia; webhook → `pagamentos_sinal.status='pago'` → consulta `pagamento='pago'`.
- [ ] Validar assinatura do webhook (HMAC `x-signature` no MP / token no Asaas) — esqueleto já comenta onde.
  **Aceite:** pagar R$ 1 de teste → linha em `pagamentos_sinal` vira `pago` sem toque humano.

### 5.3 WhatsApp oficial (paralelo — burocracia Meta 1-3 semanas)
- [ ] Criar `api/webhook-whatsapp.js`: GET de verificação (`hub.challenge` + `META_WA_VERIFY_TOKEN`); POST recebe mensagem → busca/gera conversa em `lia_conversas` → chama `/api/lia` → responde via Graph API (`/{PHONE_ID}/messages`, token `META_WA_TOKEN`).
- [ ] Templates aprovados: confirmação 24h, lembrete de retorno, reativação.
  **Aceite:** mensagem de um celular real ao número → resposta da Lia em <5s; conversa visível no console.
### 5.4 Endurecimento (antes de paciente real)
- [ ] Fotos → Supabase Storage (bucket `fotos-perfil`, público-leitura) em vez de dataURL.
- [ ] Rate limit nas funções (ex.: Upstash) e allowlist de origem no CORS.
- [ ] `console_estado` → migrar de JSONB único para escrita nas tabelas normalizadas (pacientes/consultas já existem) — sync incremental.
- [ ] Backup: Supabase PITR (plano Pro, ~US$25/mês quando houver receita) + export semanal.
- [ ] Termos de Uso + contrato fundador (advogado) publicados; DPA com o gateway.

## 6 · Runbook do fundador (o que só VOCÊ faz — comece hoje)
1. CNPJ SosMed Solutions ativo → 2. Deployment Protection OFF + 3 envs (§3) → 3. Conta gateway (CNPJ) → 4. Meta Business verificada → 5. Domínio sosmed.com.br apontando pro Vercel → 6. Advogado (termos/contrato) → 7. 3-5 betas usando semanalmente.

## 7 · Verificação de saúde executada (24/07/2026)
✅ 6 páginas: 0 erros de JS · ✅ REST anônimo lê perfis (200) · ✅ RLS bloqueia escrita indevida (401) · ✅ signup→trigger→perfil criado (testado com usuário real, depois removido) · ✅ deploy Vercel READY (4 funções) · ✅ sync `console_estado` operante · ✅ Pages servindo versão conectada · ⚠️ pendências do fundador: Deployment Protection + envs (§5.1) · e-mail de confirmação ativo (desativar p/ beta: Supabase → Auth → Providers → Email → "Confirm email" off).

*Revisado contra: schema real aplicado, endpoints reais deployados, testes executados nesta data. Divergência encontrada no futuro = atualizar este documento primeiro.*
