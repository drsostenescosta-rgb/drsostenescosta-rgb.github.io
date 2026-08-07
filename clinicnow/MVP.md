# ClinicNow — Especificação do MVP (28/07/2026)

Evolução do MedGroth para a marca internacional. Estado: **MVP DE CÓDIGO COMPLETO** — funil, app, sync na nuvem, painel, analytics e testes e2e verdes. O que resta depende de ações do fundador (checklist abaixo).

## ✅ Handoff — o que só o fundador pode destravar

1. **Criar seu usuário de login** no Supabase (dashboard → Authentication → Users → Add user) — destrava o painel (`painel.html`) e o "Conectar à nuvem" do app. 2 minutos.
2. **Publicar na `main`** — todo o produto está nas branches; sem merge, o site público não muda. Pedir o merge/PR quando quiser ir ao ar.
3. **Testar o funil com 5 médicos reais** (Sprint 1 — bloqueador absoluto do comitê): landing → demo → aplicação → cockpit. Os leads caem no painel.
4. **Escolher o gateway de cobrança** (Stripe Billing ou Mercado Pago Assinaturas) — único item de produto que falta para cobrar de verdade (`docgrow_pagamentos.externo_id` já espera o id do gateway).
5. **Conta Vercel** para as funções serverless: `/api/groth` (IA com guarda-corpos CFM) e notificação de lead novo por webhook.
6. **Domínios + INPI + parecer ANS + programas de startup** (pendências com prazo no BACKLOG, até 31/ago).

## O que já está pronto

| Peça | Estado | Onde |
|---|---|---|
| Banco 5 camadas (10 tabelas + 2 views, RLS total) | ✅ no ar | Supabase `yaqphldowpshhrtvvfaq` (São Paulo) · espelho em `DATABASE.sql` |
| Landing internacional com pricing US$ 39/99/299 | ✅ publicada | `index.html` (tráfego pago só após 2 casos documentados — comitê) |
| Funil de captura + fallback local (nenhum lead se perde) | ✅ herdado | `../medgroth/captura.html` → `medgroth_leads` |
| App funcional BR (diagnóstico, plano, CRM, metas) | ✅ herdado | `../medgroth/app.html` |
| Views de valor: Practice Health Score + Cofre de Receita Recuperada | ✅ no ar | `docgrow_health_score`, `docgrow_cofre_recuperado` |
| Auditoria (revisão, saúde/compliance, supervisão, inovação) | ✅ 28/07 | pareceres consolidados em `../ideias/` |
| **App funcional ClinicNow** (cockpit Cofre+Health Score, agenda×pagamento, CRM, follow-ups, assinaturas, GrothPedia) | ✅ 28/07 | `app.html` — local-first |
| Sincronização com a nuvem (login Supabase e-mail/senha + upsert RLS nas tabelas `docgrow_*`) | ✅ 28/07 | `app.html` ("Conectar à nuvem") |
| Aplicação curada Apply-to-Join (20 vagas de fundador) | ✅ 28/07 | `aplicacao.html` → `medgroth_leads` |
| Painel do fundador (leads em tempo real + WhatsApp) | ✅ 28/07 | `painel.html` (login Supabase) |
| Demo pública de IA de campo único (diagnóstico/plano/script por regras) | ✅ 28/07 | `index.html#demo` — sem chave no frontend |

## Escopo do MVP (Sprints 1–3 do BACKLOG)

1. **Sprint 1 (bloqueador):** 5 médicos reais percorrem funil completo — captura → diagnóstico → plano → conversa WhatsApp. Zero mídia paga antes.
2. **Sprint 2:** auth Supabase no app (perfis em `docgrow_profiles`), gateway de pagamento (definir Pix/cartão; `docgrow_pagamentos.externo_id` já previsto) e **tela inicial = "quanto o produto te gerou em R$ este mês"** (Cofre + Health Score).
3. **Sprint 3:** agenda + follow-ups (`docgrow_consultas`, `docgrow_followups`): confirmação anti no-show via WhatsApp, recall/retorno, coleta de reviews Google; filtro CFM 2.336/2023 no `/api/groth`.

Fora do MVP: telemedicina em vídeo (exige fluxo de consentimento Res. 2.314/2022 antes), CareLoop standalone, MedVerse (adiado — gatilhos no BACKLOG).

## Guarda-corpos herdados (não mudam)

Chave de IA só em função serverless · IA como apoio com log em `docgrow_eventos` · dados no Brasil/LGPD · preço de fundador sagrado (MedGroth mantém R$ 97/297/997) · comunicação sem promessa de resultado.

## Pricing internacional

US$ 39 / 99 / 299 por mês — ancorado abaixo do menor concorrente global (Vezeeta US$ 43, Tebra US$ 49, Doctolib ~US$ 120). Brasil cobra em reais pelo câmbio do dia. Revisão trimestral contra a mesma cesta.
