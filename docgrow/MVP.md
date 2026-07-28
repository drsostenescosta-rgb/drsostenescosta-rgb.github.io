# DocGrow — Especificação do MVP (28/07/2026)

Evolução do MedGroth para a marca internacional. Estado: **fundação pronta** — banco em 5 camadas no ar, landing publicada com preço em dólar, compliance auditado por agentes. Este documento define o que é o MVP e o que falta para ligá-lo.

## O que já está pronto

| Peça | Estado | Onde |
|---|---|---|
| Banco 5 camadas (10 tabelas + 2 views, RLS total) | ✅ no ar | Supabase `yaqphldowpshhrtvvfaq` (São Paulo) · espelho em `DATABASE.sql` |
| Landing internacional com pricing US$ 39/99/299 | ✅ publicada | `index.html` (tráfego pago só após 2 casos documentados — comitê) |
| Funil de captura + fallback local (nenhum lead se perde) | ✅ herdado | `../medgroth/captura.html` → `medgroth_leads` |
| App funcional BR (diagnóstico, plano, CRM, metas) | ✅ herdado | `../medgroth/app.html` |
| Views de valor: Practice Health Score + Cofre de Receita Recuperada | ✅ no ar | `docgrow_health_score`, `docgrow_cofre_recuperado` |
| Auditoria (revisão, saúde/compliance, supervisão, inovação) | ✅ 28/07 | pareceres consolidados em `../ideias/` |

## Escopo do MVP (Sprints 1–3 do BACKLOG)

1. **Sprint 1 (bloqueador):** 5 médicos reais percorrem funil completo — captura → diagnóstico → plano → conversa WhatsApp. Zero mídia paga antes.
2. **Sprint 2:** auth Supabase no app (perfis em `docgrow_profiles`), gateway de pagamento (definir Pix/cartão; `docgrow_pagamentos.externo_id` já previsto) e **tela inicial = "quanto o produto te gerou em R$ este mês"** (Cofre + Health Score).
3. **Sprint 3:** agenda + follow-ups (`docgrow_consultas`, `docgrow_followups`): confirmação anti no-show via WhatsApp, recall/retorno, coleta de reviews Google; filtro CFM 2.336/2023 no `/api/groth`.

Fora do MVP: telemedicina em vídeo (exige fluxo de consentimento Res. 2.314/2022 antes), CareLoop standalone, MedVerse (adiado — gatilhos no BACKLOG).

## Guarda-corpos herdados (não mudam)

Chave de IA só em função serverless · IA como apoio com log em `docgrow_eventos` · dados no Brasil/LGPD · preço de fundador sagrado (MedGroth mantém R$ 97/297/997) · comunicação sem promessa de resultado.

## Pricing internacional

US$ 39 / 99 / 299 por mês — ancorado abaixo do menor concorrente global (Vezeeta US$ 43, Tebra US$ 49, Doctolib ~US$ 120). Brasil cobra em reais pelo câmbio do dia. Revisão trimestral contra a mesma cesta.
