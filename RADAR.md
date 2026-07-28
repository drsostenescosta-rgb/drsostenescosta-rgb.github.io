# RADAR — Pontos Falhos da Empresa (MedGroth)
> Gerado pelo sistema founder-100x · Missão "10 primeiros clientes pagantes" · atualizado em 2026-07-28
> Regra: item sem evidência citada não entra. Gravidade: 🔴 crítico (bloqueia o gate) · 🟠 alto · 🟡 médio.

| # | Ponto falho | Evidência | Gravidade | Dono | Corrige em |
|---|-------------|-----------|-----------|------|------------|
| P4 | **Não existe forma de pagar.** Nenhum link de assinatura nos 3 planos; nenhuma transação testada; tempo "sim"→dinheiro = infinito | Veredito CEO-2 (Fase 1 e Fase 3); todos os CTAs → WhatsApp | 🔴 | Financeiro (próxima onda) + Founder | Abertura do gate |
| P4b | **Emissor fiscal indefinido** — quem fatura: CNPJ, MEI, PF? | Veredito CEO-2 Fase 3: "nenhum documento responde" | 🔴 | **Founder (porta de mão única)** | Antes da 1ª cobrança |
| P8 | **Zero conversas reais com clientes documentadas; zero leads no banco** | `medgroth_leads` = 0 linhas (verificado 2x no Supabase); nenhuma objeção registrada | 🔴 | Vendas + Founder (lista de contatos) | Abertura do gate |
| P10 | Consentimento LGPD não persistido + porta lateral do cadastro-app | Vereditos CEO-1/CEO-3 Fase 3 | 🔴→em correção | Engenharia (rodada 2 em curso) | Rodada 2 |
| P11 | 6 protocolos do app com promessa de desfecho clínico (CFM) | `app.html:152-166`; `juridico/revisao-cfm.md` item 2 CRÍTICO | 🔴→em correção | Engenharia (rodada 2 em curso) | Rodada 2 |
| P5 | **Funil sem máquina nas juntas de meio**: ESP/disparador de e-mails inexistente, remetente indefinido, descadastro sem mecanismo | `campanha/emails.md` seção "Pendências para o disparo" | 🟠 | Engenharia + Founder (escolher ESP = gasto, mão única) | Pré-disparo da campanha |
| P5b | Rastreamento de `origem` por canal precisa estar confiável desde o dia 1 (senão o checkpoint do dia 30 fica incontável) | Auto-avaliação Marketing rodada 2, item 3 | 🟠 | Engenharia | Antes do post 1 |
| P7 | **Default alive/dead não respondível**: caixa, custos e runway não documentados em lugar nenhum | Nenhum arquivo financeiro no repositório | 🟠 | Financeiro (próxima onda) | Próxima missão |
| P9 | Retenção/uso não instrumentado (app 100% local; fundador não vê uso) | Veredito CEO-1 Fase 1 (zero telemetria) | 🟠 | Engenharia | Missão pós-gate (Sprint 2) |
| P14 | Base desatualizada: BACKLOG dizia "SQL pendente" com tabela já criada; duplicata `docgrow_*` (25 tabelas) sem registro de decisão | Achado 2x por agentes distintos (L7) | 🟡 | Correção de Sistema | Próxima manutenção |
| P1 | Oferta divergente campanha × termos ("20 fundadoras/vitalício") | Vereditos 3/3 Fase 3 | 🟡→corrigido rodada 2, aguardando verificação final | Orquestrador | Verificação do gate |
| P15 | Baseline do tempo de ciclo: 1ª missão em curso (medir a partir da 2ª) | — | 🟡 | Correção de Sistema | Contínuo |

## Decisões de mão única na mesa do Founder (as únicas esperas legítimas)
1. **Emissor fiscal** (P4b) — sem isso a 1ª cobrança é informal.
2. **Meio de pagamento** — Mercado Pago Assinaturas vs Stripe (envolve criar conta/custos).
3. **Oferta**: reinstaurar "20 fundadoras" com contador real + cláusula, ou manter "enquanto ativa" (campanha já alinhada à segunda; variante B pronta).
4. **ESP de e-mail** (quando o disparo for autorizado) — envolve custo e domínio.

Tudo o mais roda em Modo Autônomo (Conselho 2/3, registrado em DECISOES.md).
