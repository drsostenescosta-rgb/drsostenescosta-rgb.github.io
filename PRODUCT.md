# PRODUCT.md — ClinicNow (ecossistema Zatheon)

Fonte da verdade do produto para trabalho de design. Derivado do banco de ideias (`ideias/`), das decisões do comitê (28/07/2026) e do MVP entregue. Marca atualizada de DocGrow → **ClinicNow** por diretriz do fundador (31/07/2026); URLs (`/docgrow/`) e schema do banco (`docgrow_*`) permanecem por estabilidade — migração de rota é decisão futura.

## O que é

ClinicNow é o cockpit de crescimento e operação do médico de consultório: diagnóstico de crescimento, agenda unificada (presencial + tele) com status de pagamento, CRM de pacientes com recall automático, follow-ups de WhatsApp que viram receita medida (Cofre de Receita Recuperada), protocolos por assinatura (recorrência ética) e Practice Health Score. Evolução do MedGroth (marca BR de transição, migração sem custo, preço de fundador preservado).

## Para quem

Médicos brasileiros com consultório próprio (nichos: emagrecimento, longevidade, estética, performance, saúde mental, dor, clínica geral), que dependem de indicação e não têm método de captação/retensão. Persona compradora = o próprio médico; decisor único; compra pelo WhatsApp.

## Superfícies e modos

| Superfície | Arquivo | Modo |
|---|---|---|
| Landing de vendas | `docgrow/index.html` | Persuade |
| Aplicação (20 vagas de fundador) | `docgrow/aplicacao.html` | Persuade |
| Cockpit (o sistema) | `docgrow/app.html` | Operate |
| Painel do fundador (leads/funil) | `docgrow/painel.html` | Operate |

## Verdades que o design nunca pode violar

1. **Publicidade médica (Res. CFM 2.336/2023):** nenhuma promessa de resultado, superlativo ("o melhor", "garantido") ou antes/depois. Prova de valor = número medido do próprio usuário (Cofre), nunca projeção vendida como fato.
2. **Nunca "plano de saúde"** — assinatura de cuidado é contrato de serviços (ANS é intocável).
3. **Telemedicina** só com consentimento registrado (Res. CFM 2.314/2022) — o produto trava isso.
4. **Dados no Brasil** (Supabase São Paulo, LGPD, RLS) — é argumento de venda, estampar com orgulho.
5. **Preço de fundador é sagrado**: BR R$ 97/297/997 travado; internacional US$ 39/99/299 (ancorado abaixo de Vezeeta/Tebra/Doctolib).
6. Nenhum lead se perde: fallback local sempre; chave de IA nunca no frontend.

## Identidade visual incumbente (preservar em refinamentos)

Dark premium: fundo `#04080a`, verde-esmeralda `#19c37d` como cor de ação, dourado `#c9a227` para valor/fundador, serif Fraunces para títulos, Inter para corpo, JetBrains Mono para dados/etiquetas. Orbs difusos de fundo, cards translúcidos com borda sutil. Tom de voz: direto, ético, sem hype — "método, não promessa".

## Métricas que o design serve (comitê)

30 diagnósticos/mês · lead→conversa ≥ 40% · 10 clientes pagantes · churn zero (fundadoras ativas na semana 4).
