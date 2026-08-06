# Ecossistema unificado + catálogo vivo de projetos — 06/08/2026

**Origem:** diretriz do fundador (sessão de 06/08) + fusão dos trabalhos Claude/Codex. Evolui: `2026-07-tres-produtos.md`, `2026-08-site-pessoal-trajetoria.md`.

## Decisões registradas

1. **Catálogo vivo no banco** — tabela `public.projetos` no Supabase (12 projetos), leitura pública alimenta a aba `/projetos/` do site; espelho estático como fallback. Atualizar o banco = site atualiza sozinho.
2. **Unificação de nomes** (fim das duplicatas):
   - ClinicNow = ex-MedGroth/DocGrow · une Farol + Lia + motor de crescimento.
   - CareLoop = o "Sistema de Fidelização".
   - MedVerse = o "Atlas de Medicina" (+ máquina de artigos; inspiração Chagas AI).
   - **ClinicNow Cabin** = ex-"Clinic Now Access" (hackathon): corredor eConsult + cabines assistidas com aferição de sinais. Página: `docgrow/cabin.html`.
   - **Emily** = assistente pessoal + vendedora de clínica (absorve "Clinic Negotiation / Selling for Clinics" e o agente de voz do Clinic Now Lab). ⚠️ código só no Mac do fundador — subir ao GitHub.
3. **Aba Projetos** (`/projetos/`) com selos honestos (em estruturação / tese / ideia / protótipo / arquivo) — linguagem compatível com a governança (nada de "validado" sem evidência).
4. **Página do ecossistema** (`/projetos/ecossistema.html`): mapa SVG, 5 loops de retroalimentação, pontos em aberto com ação, benchmark de 10 players.

## Os 5 loops de retroalimentação (tese de ecossistema)

| Loop | Circuito |
|---|---|
| Receita | Emily → ClinicNow → CareLoop → Cofre → novo cliente |
| Dado clínico | MedEasy → prontuário → recall → retorno |
| Formação | MedVerse → médico formado → ClinicNow → casos → MedVerse |
| Acesso | Cabin → eConsult → rede ClinicNow → operadora |
| Família | Genecys → consulta → família → ecossistema |

## Ideias novas a evoluir

- **Emily com duas vertentes** (pessoal + vendas) num mesmo cérebro, com guardrails do lab (consentimento, opt-out vence, handoff humano, preço determinístico).
- **Cabin como canal, não produto**: hardware só entra se o piloto provar falha por conectividade/privacidade/letramento/instrumento (gate do CEO Council 02/08).
- **MedVerse alimentando a rede**: médico formado no MedVerse entra no ClinicNow com condição de aluno — CAC próximo de zero no longo prazo.

## Status

- registrada → **em produto** (catálogo + páginas publicadas no branch `claude/medgroth-projeto-funcional-3id126`)
- Pendências: subir Emily ao GitHub; benchmark de 10 players (agente em execução, resultado entra em `/projetos/ecossistema.html`).
