# SPEC — Agente de Vendas IA no WhatsApp (ClinicNow) · v1
> Base: `founder-100x/references/playbook-agente-whatsapp.md` · Init Impecável aplicado · 2026-07-29

## Objetivo
Agente autônomo no WhatsApp que atende leads do funil ClinicNow 24/7, educa antes de vender (Mecanismo Único), classifica `intent`, agenda a conversa de 15 min só em alta intenção, e dá ao Founder um dashboard com visão total + botão "Pausar IA" (takeover). Anti-caixa-preta por construção.

## Regra 1-1-1 do ClinicNow
- **Público**: dono(a) de clínica/consultório de saúde (todas as profissões do ICP).
- **Problema**: agenda imprevisível — sabe cuidar, não sabe captar/cobrar.
- **Promessa**: sistema + mentoria que torna a agenda previsível (nunca prometer números).
- **Causa Surpreendente (educação antes da venda)**: "o problema não é falta de divulgação — é a cadeia de conversão sem dono: cada paciente que some no meio do funil é receita que já era sua". Guarda-corpos de conselho valem no chat (sem promessa de desfecho).

## Arquitetura v1
- `api/webhook.js` (Vercel serverless): verificação Meta (GET) + recepção de mensagens (POST) → grava no Supabase → chama Anthropic → responde via Graph API. Meta < 5s: responder 200 imediato e processar; medir latência ponta a ponta.
- Modelos: `claude-sonnet-5` (conversa) + `claude-haiku-4-5` (classificação de intent em paralelo, barata). System prompt versionado em `specs/prompt-agente-v1.md` (a criar na implementação; passa por fiscalização e filtro multi-conselho).
- Supabase (novas tabelas): `clinicnow_wa_conversas` (phone, nome, ai_paused bool, intent_atual, criado_em) e `clinicnow_wa_mensagens` (message_id, conversa_id, direction in/out, content, intent, model, latency_ms, timestamp). RLS: acesso só via service role (servidor); dashboard autenticado.
- Dashboard `dashboard/` (Vercel, protegido por login): conversas ao vivo, intents, latência, botão **Pausar IA** por conversa (grava `ai_paused`; webhook respeita), botão "Assumir no WhatsApp".
- Calendly: link do evento "Conversa ClinicNow — 15 min" disparado SOMENTE quando intent = `alta_intencao`; nunca repetir o link na mesma conversa sem pedido.
- Intents v1: `saudacao` · `duvida_produto` · `duvida_preco` · `objecao` · `alta_intencao` · `suporte_cliente` · `fora_escopo` · `humano_solicitado` (→ pausa automática + notificação ao Founder).

## Definition of Done (testes cobrirão)
1. Webhook verifica token e recebe "Olá" → mensagem gravada + resposta entregue < 5s (latência medida e gravada).
2. Intent classificada e gravada em 100% das mensagens de entrada.
3. Calendly só aparece com `alta_intencao` (teste com conversa simulada de baixa intenção: link NUNCA aparece).
4. "Pausar IA" pausa DE VERDADE (mensagem chega, nada é respondido, dashboard sinaliza) e despausar retoma.
5. IA se identifica como assistente quando perguntada (teste de transparência).
6. Zero promessa de desfecho clínico/financeiro no prompt e nas respostas (grep + teste de conversa adversarial).
7. Consentimento: primeira resposta informa que a conversa é registrada, com link da política (LGPD).
8. Env vars documentadas; zero segredo no repo (teste de grep por padrões de chave).

## Credenciais necessárias (MÃO ÚNICA — só o Founder)
| # | O quê | Onde |
|---|------|------|
| 1 | Meta: App Business + Phone Number ID + System User token permanente (3 permissões do playbook) | developers.facebook.com / Business Manager |
| 2 | ANTHROPIC_API_KEY | console.anthropic.com |
| 3 | Calendly Personal Access Token + URL do evento de 15 min | calendly.com |
| 4 | Projeto Vercel para o agente (pode ser o time sosmedai já conectado) | vercel.com |
| 5 | Supabase: usar o projeto existente (tabelas novas via migração) | já temos acesso |

## Fases
- **F1 (pronta para rodar quando as credenciais chegarem)**: webhook + Supabase + prompt v1 + testes herméticos com payloads reais da Meta (fixtures oficiais) — implementável AGORA com mocks; deploy real na chegada dos tokens.
- **F2**: dashboard com takeover.
- **F3**: Calendly + notificação de alta intenção ao Founder (WhatsApp/e-mail).
- **F4 (operação)**: revisão semanal de intents (Correção de Sistema + Vendas), par de métricas: conversas → agendamentos → clientes.

## Fora do escopo v1
Disparo ativo em massa (regras anti-spam Meta + LGPD exigem opt-in — fica com o funil de captura), voz/áudio, multi-atendente, CRM bidirecional completo (v2 junto com contas na nuvem).
