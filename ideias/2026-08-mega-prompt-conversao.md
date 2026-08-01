# Mega-Prompt de conversão (vídeo Hostinger) — triagem e aplicação (01/08/2026)

Origem: resumo enviado pelo fundador do vídeo de referência (engenharia de conversão high-ticket). Regra do banco: diretriz registrada + o que foi feito com ela. Vinculado a `2026-08-hostinger-dominio.md`.

## Aplicado agora na landing do ClinicNow (01/08)

| Ideia do vídeo | Como entrou (adaptado às regras CFM/Zatheon) |
|---|---|
| **Regra 1-1-1** (um público, um problema, uma promessa) | Hero reescrito: médico de consultório → paciente que some → "operamos a continuidade e medimos em reais". Promessa = medição, nunca resultado garantido |
| **Causa Surpreendente Principal + Mecanismo Único** | Nova seção `#causa`: por que post/tráfego/secretária falharam → causa real (nenhum próximo passo operado após a consulta) → mecanismo **Loop de Continuidade** com prova no Cofre |
| **Linguagem real do comprador** | Copy usa as frases do médico ("dependo de indicação", "paciente some", "agenda com buracos") — mineradas do benchmark e das conversas reais do nicho, não de scraping |
| **CTA afunilado + WhatsApp imediato com contexto** | CTA primário único (diagnóstico → aplicação); botão flutuante de WhatsApp com mensagem pré-preenchida; a demo carrega a descrição da clínica no contexto |
| **Auto-teste dos fluxos antes do deploy** | Já é prática da casa: e2e Playwright do funil inteiro roda a cada mudança + hook de design do impeccable a cada edição |

## Vira roadmap (depende de conta externa — decisão do fundador)

- **Agente de IA no WhatsApp (Meta Cloud API + Supabase)** qualificando lead 24/7 com link de agendamento, e **human takeover** pelo painel (o painel atual já é o dashboard de controle v1, com pipeline manual). Requisitos: WhatsApp Business API (Meta), função serverless (Vercel), guarda-corpos CFM no prompt do agente e log auditável em `docgrow_eventos`. → adicionado ao Sprint 3 do BACKLOG.
- **Dashboard de conversas em tempo real** — evolução do painel quando o agente existir.
- **Domínio próprio** — já analisado em `2026-08-hostinger-dominio.md`.

## Descartado (com motivo — nada se perde)

- **Testemunhos raspados da web**: vedado. Publicidade médica exige casos reais, com consentimento por escrito (Res. CFM 2.336/2023) — regra do comitê: só após os 2 primeiros casos documentados.
- **Renders 3D, animações de scroll, componentes 21st.dev**: contraria a direção aprovada pelo fundador (simples, sofisticado, sem cara de IA) e pesaria uma página que hoje carrega instantânea, sem dependências.
- **Firecrawl/scraping de fóruns**: a linguagem do comprador virá da fonte melhor que existe — as conversas reais do funil no WhatsApp do fundador, registradas no painel.
- **Posicionamento high-ticket $10k+**: nosso modelo é SaaS de fundador com preço público (decisão estratégica anti-Treint: preço transparente = CAC menor).
