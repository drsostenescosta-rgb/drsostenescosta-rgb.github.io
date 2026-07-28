# MedGroth · Backlog do produto

**Atualizado em 26/07/2026.** MedGroth é a camada de crescimento do ecossistema (MedEasy + SosMed + MedGroth). Este backlog cobre produto, vendas, hospedagens e backend.

## O que já está no ar (feito neste ciclo)

- [x] **Página de vendas** (`medgroth/index.html`) — método, produto, 3 planos (Start R$ 97 / Pro R$ 297 / Aceleração R$ 997), FAQ, CTAs
- [x] **Página de captura** (`medgroth/captura.html`) — lead magnet "diagnóstico gratuito em 3 minutos"; lead salvo localmente + tentativa no Supabase + ponte para WhatsApp
- [x] **App funcional** (`medgroth/app.html`) — cadastro, diagnóstico de 7 perguntas, plano de 4 semanas com checklist persistente, protocolos precificados por nicho, CRM kanban de leads (importa os da captura), backlog de execução e painel de metas
- [x] **Memorando para investidores** (`medgroth/investidores.html`) — problema, mercado, modelo de receita, plano de vendas em 4 fases, projeções e uso de capital
- [x] **Config de backend** (`medgroth/config.js`) — Supabase compartilhado com o SosMed, gravação de leads com fallback local (nunca perde lead)
- [x] Card do MedGroth no site pessoal (seção "no que trabalho")

## Decisões do comitê — 28/07/2026

Fonte: `../ideias/2026-07-comite-aprovacao.md`. Este bloco prevalece sobre qualquer meta anterior deste arquivo. Revisão: primeira quinzena de outubro/2026.

### Regra de frente única
- DocGrow/MedGroth é O produto até outubro/2026. Nenhuma linha de código de CareLoop ou MedVerse antes de 5 médicos reais percorrerem o funil completo (Sprint 1 é bloqueador absoluto; zero mídia paga antes disso).

### Metas revisadas (substituem as anteriores)
- Marketing 90 dias: **1.500 seguidores qualificados** e **30 diagnósticos/mês**.
- WhatsApp: **janelas fixas de resposta + primeira resposta automatizada** (o SLA "<1h" foi reprovado).
- Meta 2026: **40–60 clientes / MRR R$ 12–18 mil**; se dezembro fechar abaixo de 30 clientes, replanejar a curva 2027+.
- Métricas exigidas até outubro: ≥30 diagnósticos/mês gravados no Supabase com lead→conversa ≥40%; ≥10 clientes pagantes com cobrança recorrente ativa; 100% das fundadoras ativas na semana 4 e churn zero no trimestre (cancelamento exige post-mortem escrito).

### Adições obrigatórias por sprint
- **Sprint 2:** dashboard "quanto o produto te gerou em R$ este mês" como **tela inicial** do app (lição Zocdoc). Views `docgrow_health_score` e `docgrow_cofre_recuperado` já criadas no Supabase (28/07).
- **Sprint 3:** confirmação de consulta anti no-show via WhatsApp + coleta ativa de reviews Google (ROI comprovado — Doctolib/Tebra). Filtro CFM no `/api/groth`: veto a promessa de resultado, superlativos e antes/depois fora das hipóteses da Res. 2.336/2023.
- **Sprint 4:** landing internacional DocGrow **somente após 2 casos documentados** (a página `../docgrow/` já existe com preço em US$; tráfego só após o gatilho).

### Gatilhos de expansão (nada anda sem a métrica)
- **CareLoop módulo-piloto (3–5 fundadoras):** liberar com 10 clientes pagantes DocGrow + parecer jurídico ANS entregue. As 5 condições do advogado são vinculantes.
- **CareLoop standalone:** 5 médicos com ≥5 pacientes assinantes ativos cada.
- **MedVerse:** ADIADO. Desbloqueio: MRR ≥ R$ 30 mil e churn < 3% por 2 meses, OU cofundador dedicado. Autorizado desde já só o teste de fumaça (bot "questão do dia": 500 usuários, D30 > 40%).

### Pendências com prazo (até 31/ago/2026)
- [ ] Registrar domínios disponíveis das 4 marcas (esta semana)
- [ ] Buscas INPI (classes 9/42/44) antes de material público — obrigatório para MedVerse
- [ ] Encomendar o parecer jurídico ANS do CareLoop
- [ ] Teste de pricing por resultado (take rate) com 2–3 fundadoras
- [ ] Fluxo de consentimento de telemedicina (Res. 2.314/2022) antes do 1º vídeo
- [ ] Inscrição em 2 programas de startup (NVIDIA Inception, Google/Microsoft for Startups, AWS Activate)

## Hospedagens & infraestrutura

| Camada | Onde | Status |
|---|---|---|
| Site + páginas (vendas, captura, app, investidores) | **GitHub Pages** — `drsostenescosta-rgb.github.io/medgroth/` | ✅ no ar com o push |
| Banco (leads, futuras assinaturas) | **Supabase** projeto `sosmed` (`yaqphldowpshhrtvvfaq`, região São Paulo) | ✅ tabela `medgroth_leads` criada com RLS (insert anônimo, leitura autenticada) |
| Funções serverless (IA, webhooks de pagamento) | **Vercel** time `sosmedai` (mesmo deploy do SosMed) | ⏳ próximo ciclo |
| Domínio próprio (`medgroth.com.br` ou `medgroth.app`) | Registro.br / Vercel Domains | ⏳ decidir e apontar |
| E-mail transacional (boas-vindas, recuperação de lead) | Resend ou Brevo (camada gratuita) | ⏳ próximo ciclo |

### SQL já aplicado no Supabase (referência)

```sql
create table if not exists public.medgroth_leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  whatsapp text not null,
  email text,
  especialidade text,
  faturamento text,
  origem text default 'site',
  respostas jsonb,
  criado_em timestamptz default now()
);
alter table public.medgroth_leads enable row level security;
-- visitante anônimo pode CADASTRAR, mas nunca ler os leads dos outros
create policy "captura publica insere" on public.medgroth_leads
  for insert to anon with check (true);
-- leitura só autenticado (painel do fundador)
create policy "leitura autenticada" on public.medgroth_leads
  for select to authenticated using (true);
```

## Sprint 1 — Funil vivo (destrava a venda)

- [x] Rodar o SQL acima → captura gravando 100% no banco real
- [ ] Painel do fundador: página simples que lista `medgroth_leads` (login Supabase) com botão "chamar no WhatsApp"
- [ ] Notificação de lead novo no WhatsApp/e-mail do fundador (função Vercel + webhook do Supabase)
- [ ] Pixel/analytics (Umami ou Plausible) nas 4 páginas para medir captura → diagnóstico → conversa
- [ ] Teste do funil completo com 5 médicos reais da rede do fundador

## Sprint 2 — Conta na nuvem e cobrança

- [ ] Login real no app (Supabase Auth, mesmo padrão do SosMed) mantendo o modo local como fallback
- [ ] Sincronizar `medgroth_db` (diagnóstico, checks, leads, tarefas) com o banco por usuário
- [ ] Assinatura dos planos (Stripe Billing ou Mercado Pago Assinaturas) + tabela `assinaturas` compartilhada
- [ ] Bloqueio suave por plano: Start (diagnóstico+plano+CRM) vs Pro (metas, scripts, integração MedEasy)
- [ ] Contador real de vagas de fundador (20) lendo do banco

## Sprint 3 — Diferencial de IA e ecossistema

- [ ] `/api/groth`: plano de crescimento reescrito por IA (claude-sonnet-5) a partir do diagnóstico — mais específico que o motor de regras atual, com guarda-corpos (publicidade médica/CFM, sem promessa de resultado)
- [ ] Scripts de conversão gerados por IA para o nicho do usuário (roteiro da consulta de avaliação, mensagens de recall)
- [ ] Ponte MedEasy: Índice de Saúde do paciente como argumento na proposta de protocolo
- [ ] Relatório mensal automático: "sua clínica este mês" (leads, conversão, receita vs meta)

## Sprint 4 — Escala de vendas

- [ ] Casos das 20 fundadoras documentados (antes/depois de receita, com consentimento) na página de vendas
- [ ] Sequência de e-mail/WhatsApp para lead que não avançou (recuperação)
- [ ] Programa de indicação (médico indica médico, ambos ganham mês grátis)
- [ ] Versão em inglês das páginas (visto o posicionamento Vale do Silício)
- [ ] Tráfego pago sobre o funil validado (orçamento inicial pequeno, medir CAC)

## Regras que não mudam

1. **Nenhum lead se perde** — fallback local sempre ativo; banco é espelho, não gargalo.
2. **Venda ética** — tudo que o produto recomenda respeita publicidade médica (CFM); prova de valor = resultado medido de receita/gestão do consultório, nunca promessa e jamais resultado clínico de pacientes (Res. CFM 2.336/2023).
3. **Chave de API nunca no frontend** — IA e pagamentos só via funções serverless.
4. **Preço de fundador é sagrado** — quem entrar nas 20 primeiras mantém o preço para sempre.
