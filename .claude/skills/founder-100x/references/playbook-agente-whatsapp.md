# Playbook — Agente de Vendas IA no WhatsApp + Dashboard

Habilidade permanente do sistema (origem: plano técnico do Founder, 2026-07-29). Um agente de vendas IA não é "set and forget": é um **ativo digital** com dashboard de monitoração — sem ele, o WhatsApp API vira caixa-preta e o dono perde o controle de qualidade e a intervenção estratégica. Este playbook direciona cada parte ao setor dono.

## Arquitetura de referência

```
Lead (WhatsApp) ⇄ Meta WhatsApp Business API ⇄ Webhook (Vercel /api/webhook)
                                                    │
                              Claude (Anthropic API) ┤ classifica `intent` + responde
                                                    │
                                     Supabase (mensagens + metadados + intents)
                                                    │
                    Dashboard (Vercel): conversas ao vivo · intents · botão "Pausar IA"
                                                    │
                     Calendly API: dispara agendamento SÓ em alta intenção
```

Stack: **Meta WhatsApp Business API** (transporte oficial, anti-banimento) · **Supabase** (cérebro de persistência — a inteligência sai do celular e vira dado acionável) · **Vercel** (webhook + dashboard, resposta < 5s) · **Anthropic API** (modelos atuais: `claude-sonnet-5` para a conversa; `claude-haiku-4-5` para classificação de intent barata em escala — NÃO usar modelos legados citados em tutoriais antigos) · **Calendly API** (motor de fecho).

## Responsáveis por setor (quem faz o quê)

| Parte | Setor dono | Contrato |
|---|---|---|
| Webhook, Supabase, deploy, env vars, dashboard | **Engenharia** | Spec antes de código; testes L1 (payload real); resposta < 5s medida |
| Prompt de vendas (Regra 1-1-1, Mecanismo Único), roteiro de takeover | **Vendas & Contratos** | Um público, um problema, uma promessa — cirúrgico |
| Causa Surpreendente / educação antes da venda | **Marketing** | Autoridade por educação, nunca pressão; vetos de conselho valem no chat |
| Opt-in, LGPD, retenção de conversas, publicidade em saúde no chat | **Jurídico** | Consentimento registrado; IA se identifica como assistente; sem promessa de resultado |
| Jornada da conversa (aha, fricção, tom) | **UX & Jornada** | A conversa é uma jornada — mapa e auditoria |
| Revisão semanal dos logs de `intent` | **Correção de Sistema** | Ciclo de reaprendizado do agente: ajustar tom/prompt pela evidência |
| Fiscalização de tudo | **3 CEOs** | Nota ≥ 9; CEO-3 caça dark patterns no chat com lupa |

## Setup Meta (Engenharia + Founder — contas são mão única)
1. App tipo "Business" em developers.facebook.com; distinguir número de teste vs produção; extrair o **Phone Number ID**.
2. **PROIBIDO token temporário de 24h em produção** (falha catastrófica de continuidade). Criar **System User** no Business Manager → token permanente com as 3 permissões obrigatórias: `whatsapp_business_messaging`, `whatsapp_business_management`, `messaging`.
3. Webhook: Callback URL (`https://<app>.vercel.app/api/webhook`) + Verify Token forte (string aleatória — NUNCA exemplos fracos de tutorial) definido no código e no painel; subscrever o campo **messages**.

## Dados (Supabase)
Tabela de mensagens (mínimo): `message_id` · `content` · `phone_number` · `timestamp` · `direction` (in/out) · **`intent`** (o campo crítico: a IA classifica o objetivo do lead — ex.: "dúvida de preço", "interesse em plano", "alta intenção de compra") · `ai_paused` (boolean do takeover). RLS: service role no servidor; NADA de chave secreta no frontend (regra da casa). Consentimento LGPD do lead registrado com timestamp e versão da política (L1 desta empresa).

## Regras de conversão (a estratégia High Ticket)
- **Regra 1-1-1**: um público, um problema, uma promessa. IA que vende tudo para todos não vende nada.
- **Mecanismo Único**: nunca vender direto — educar sobre a "Causa Surpreendente" do problema antes da oferta (autoridade imediata). Em saúde: a causa educativa passa pelos guarda-corpos de conselho (sem promessa de desfecho).
- **Regra de Ouro do Calendly**: o link SÓ dispara quando `intent` = alta intenção de compra. Link spam desvaloriza high ticket.
- **Takeover humano**: botão "Pausar IA" no dashboard por conversa; lead high ticket com dúvida complexa → humano assume o fecho. A IA avisa a transição com honestidade.
- **Transparência**: a IA se identifica como assistente da clínica quando perguntada — mentir sobre ser humano é dark pattern (veto CEO-3).

## Deploy e validação (Engenharia)
- Repo privado → Vercel; **causa nº 1 de falha: env vars esquecidas** (META_TOKEN, PHONE_NUMBER_ID, VERIFY_TOKEN, ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE, CALENDLY_TOKEN) — conferir ANTES do deploy.
- Checklist de validação (vira teste onde possível): env vars ok · "Olá" do lead aparece no dashboard · `intent` classificada · resposta entregue < 5s · takeover pausa de verdade · Calendly só em alta intenção.

## Operação contínua
Revisão SEMANAL dos logs de `intent` no Supabase (Correção de Sistema + Vendas): ajustar tom e prompt pela evidência, medir conversa→agendamento→cliente ([B9]: par de métricas — volume + conversão). O agente é um ativo que se refina, nunca um projeto encerrado.
