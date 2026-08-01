# ClinicNow · Agente de Vendas IA no WhatsApp — F1 (webhook)

> Spec vinculante: `../specs/SPEC-AGENTE-WHATSAPP.md` · Prompt versionado: `../specs/prompt-agente-v1.md`
> Playbook: `.claude/skills/founder-100x/references/playbook-agente-whatsapp.md`
> Modelo deste guia: `../STRIPE-SETUP.md` (passo a passo de mão única do Founder).

## O que está pronto (F1)

- `api/webhook.js` — função serverless Vercel: GET de verificação da Meta + POST de
  mensagens (formato oficial Cloud API), 200 imediato, processamento no mesmo invocation.
- `lib/` — TODA a lógica, pura e injetável (parse, classify, decide, prompt, persist,
  respond, generate, agent, security). **Nenhum arquivo de `lib/` lê `process.env`** —
  só `api/webhook.js` toca configuração (regra travada por teste).
- `migrations/001-wa-tables.sql` — tabelas `clinicnow_wa_conversas` e
  `clinicnow_wa_mensagens`, RLS service-role-only. **Aplicar no Supabase antes do deploy.**
- Suíte hermética em `../tests/agente.spec.js` (payloads reais da Meta + mocks injetados).

Fora da F1 (fases seguintes): dashboard com botão Pausar IA (F2 — o webhook JÁ respeita
`ai_paused`), Calendly + notificação de alta intenção (F3), revisão semanal de intents (F4).

## Arquitetura em uma linha

Meta (WhatsApp) → `POST /api/webhook` → grava `in` no Supabase (com `intent` via
`claude-haiku-4-5`) → decide (pausa? primeira mensagem? alta intenção?) → resposta via
`claude-sonnet-5` → envia pela Graph API → grava `out` com `latency_ms` medida.

## Variáveis de ambiente (conferir ANTES do deploy — causa nº 1 de falha)

Zero segredo no código: tudo entra por env var no painel do Vercel (Settings → Environment
Variables, escopo Production). Nunca commitar valores.

| Var | Obrigatória | O que é / onde obter |
|---|---|---|
| `VERIFY_TOKEN` | sim | String aleatória FORTE gerada por você (ex.: `openssl rand -hex 24`). Vai no código do painel Meta e aqui — nunca exemplo fraco de tutorial. |
| `META_TOKEN` | sim | Token PERMANENTE de System User (Business Manager) com `whatsapp_business_messaging`, `whatsapp_business_management`, `messaging`. **PROIBIDO token temporário de 24h.** |
| `PHONE_NUMBER_ID` | sim | ID do número em developers.facebook.com → WhatsApp → API Setup. |
| `ANTHROPIC_API_KEY` | sim | console.anthropic.com → API Keys. |
| `ANTHROPIC_MODEL` | não | Modelo da conversa. Default: `claude-sonnet-5`. |
| `ANTHROPIC_INTENT_MODEL` | não | Modelo da classificação de intent (barato). Default: `claude-haiku-4-5`. |
| `SUPABASE_URL` | sim | URL do projeto existente (mesma do `config.js`). |
| `SUPABASE_SERVICE_ROLE` | sim | Chave service role (Supabase → Settings → API). SÓ no servidor — jamais em frontend ou repo. |
| `GRAPH_API_VERSION` | não | Default `v23.0`. |
| `LINK_CAPTURA` | não | Default: página de captura pública do ClinicNow (convite da conversa de 15 min em alta intenção). |
| `LINK_POLITICA` | não | Default: `privacidade.html` pública (aviso LGPD da primeira resposta). |

## Rodar local

Sem credenciais, o comportamento completo roda pela suíte (mocks injetados):

```bash
cd clinicnow/tests
npm install   # uma vez
npm test      # roda a suíte inteira do repositório, incluindo agente.spec.js
```

Com credenciais (quando chegarem), teste o endpoint local com o Vercel CLI:

```bash
cd clinicnow/agente
npm install
vercel dev    # requer as env vars acima em .env.local (arquivo NUNCA commitado)
# verificação: curl "http://localhost:3000/api/webhook?hub.mode=subscribe&hub.verify_token=SEU_TOKEN&hub.challenge=42"
```

## Deploy quando as credenciais do Founder chegarem (passo a passo)

1. **Supabase (orquestrador)**: aplicar `migrations/001-wa-tables.sql` no projeto
   existente. Conferir: RLS habilitada nas 2 tabelas, nenhuma policy criada.
2. **Vercel**: criar projeto (time sosmedai) com **Root Directory = `clinicnow/agente`**.
   O `package.json` local instala `@anthropic-ai/sdk`; `api/webhook.js` vira
   `https://<app>.vercel.app/api/webhook`.
3. **Env vars**: cadastrar TODAS as obrigatórias da tabela acima e fazer o deploy.
   Deploy de preview primeiro; produção só depois do teste do passo 6 (Init Impecável:
   preview antes de produção).
4. **Meta**: em developers.facebook.com → app Business → WhatsApp → Configuration:
   Callback URL = `https://<app>.vercel.app/api/webhook`, Verify Token = `VERIFY_TOKEN`,
   assinar o campo **messages**. O painel dispara o GET — precisa voltar 200 + challenge.
5. **Número de teste primeiro**: usar o número de teste da Meta antes do número real
   (distinguir teste vs produção, como manda o playbook).
6. **Validação de ponta a ponta (gate)**: enviar "Olá" do celular →
   - resposta chega no WhatsApp com o aviso LGPD + link da política;
   - `clinicnow_wa_conversas` tem a conversa; `clinicnow_wa_mensagens` tem `in` com
     `intent` e `out` com `latency_ms` preenchida (< 5000);
   - pedir "quero falar com um humano" → resposta de transição e `ai_paused = true`;
     despausar via SQL (`update ... set ai_paused = false`) até o dashboard (F2) existir;
   - mensagem duplicada (retry) não gera resposta dupla.
7. Registrar o teste em `DECISOES.md` (data + evidência). Só então divulgar o número.

## Endurecimento já preparado (ativar no deploy)

- **Assinatura da Meta**: `lib/security.js` valida `X-Hub-Signature-256` (HMAC do corpo
  cru com o App Secret). O wiring exige o corpo cru da requisição; ativar junto com a
  env `META_APP_SECRET` na F2 (registrado como risco aceito da F1 — o `VERIFY_TOKEN`
  cobre o registro do webhook, e o POST não executa nada sem credenciais válidas de
  Supabase/Anthropic/Meta configuradas).
- **Processamento pós-resposta**: o handler responde 200 e processa em seguida no mesmo
  invocation. Se logs mostrarem corte de execução, migrar para `waitUntil` de
  `@vercel/functions` (1 dependência, troca de 3 linhas).

## Observabilidade mínima da F1

Tudo que acontece vira linha em `clinicnow_wa_mensagens` (empresa "queryable"):

```sql
-- latência ponta a ponta das respostas
select date_trunc('day', "timestamp") dia, count(*), avg(latency_ms)::int media_ms,
       max(latency_ms) pior_ms
from clinicnow_wa_mensagens where direction = 'out' group by 1 order by 1 desc;

-- distribuição de intents (revisão semanal — F4)
select intent, count(*) from clinicnow_wa_mensagens
where direction = 'in' group by 1 order by 2 desc;
```
