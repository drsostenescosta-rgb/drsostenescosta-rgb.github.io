# Registro de diretriz do fundador · MedGroth → DocGrow (28/07/2026)

Regra do banco de ideias aplicada: o pedido original do fundador fica registrado como foi feito, e abaixo dele a versão melhorada 100x — estruturada, mensurável e executável — que passa a ser a diretriz oficial. Nada se perde.

## Pedido original (verbatim)

> "https://drsostenescosta-rgb.github.io/medgroth/ salve no meu [banco] as ideias, crie um registro de informações no modo que eu criei esse prompt melhore em 100x e depois implemente as mudanças no medgroth para docgrow. rode agentes de revisão, saúde, supervisão e de inovação para ir além do básico, quero 5 camadas de profundidade toda base de dados estabelecida, sistema pronto para o MVP, página vamos mudar para preço em dólar mínimo baseado nos concorrentes"

## Diretriz melhorada 100x (versão oficial)

**Objetivo:** evoluir o MedGroth (BR) para o DocGrow (internacional) com fundação de dados pronta para MVP, qualidade auditada por agentes independentes e pricing internacional competitivo.

### 1. Governança de conhecimento
- Toda diretriz do fundador é registrada em `ideias/` no formato original + versão estruturada (este arquivo é o template).
- Agentes independentes auditam cada entrega em 4 lentes: **revisão técnica** (links, HTML, responsividade), **saúde/compliance** (CFM 2.336/2023, ANS/Lei 9.656/98, LGPD, CFM 2.314/2022, IA como apoio), **supervisão** (aderência às decisões do comitê e ao backlog) e **inovação** (o que vai além do básico usando os dados que já temos).
- Critério de pronto: nenhuma página vai a tráfego pago com parecer pior que "APTO COM RESSALVAS corrigidas".

### 2. Base de dados em 5 camadas (estabelecida em 28/07/2026 no Supabase `yaqphldowpshhrtvvfaq`, São Paulo)
| Camada | Tabelas | Função |
|---|---|---|
| 1 · Identidade | `docgrow_profiles` | Quem é o médico, plano, moeda, nicho |
| 2 · Funil | `medgroth_leads` (já existia) + `docgrow_diagnosticos` | Lead → diagnóstico → plano gerado |
| 3 · Operação | `docgrow_pacientes`, `docgrow_consultas` (com consentimento tele CFM 2.314), `docgrow_followups` | Agenda, follow-up, no-show |
| 4 · Receita | `docgrow_protocolos`, `docgrow_assinaturas_pacientes` (ponte CareLoop), `docgrow_pagamentos` | Protocolos precificados → recorrência → caixa |
| 5 · Inteligência | `docgrow_eventos`, `docgrow_metas` + views `docgrow_health_score` e `docgrow_cofre_recuperado` | Métricas, IA auditável, valor visível |
- RLS dono-único em 100% das tabelas; leads continuam com insert anônimo + leitura autenticada.
- Espelho versionado do schema: `docgrow/DATABASE.sql`. Especificação do MVP: `docgrow/MVP.md`.

### 3. Pricing internacional (implementado na página)
- Regra: **dólar mínimo abaixo do menor concorrente global** — referências: Vezeeta US$ 43, Tebra US$ 49, Doctolib ~US$ 120.
- Tabela DocGrow: **Start US$ 39 · Pro US$ 99 · Aceleração US$ 299** /mês; Brasil cobra em reais pelo câmbio do dia; assinantes MedGroth mantêm R$ 97/297/997 de fundador para sempre.
- Revisão de preço: trimestral, contra a mesma cesta de concorrentes (registrar a cesta a cada revisão).

### 4. Migração MedGroth → DocGrow
- MedGroth permanece como marca BR de transição: header e rodapé sinalizam "evoluindo para DocGrow", com migração sem custo.
- Diretriz do comitê preservada: tráfego para a landing internacional só após 2 casos documentados; MedVerse segue `noindex` até busca INPI e gatilho de lançamento.

### 5. Definição de "sistema pronto para MVP"
Checklist: banco 5 camadas no ar ✅ · schema versionado no repo ✅ · views de valor (health score + cofre) ✅ · páginas auditadas pelos 4 agentes ✅ · pricing internacional publicado ✅ · pendências do fundador documentadas (SQL de auth no Sprint 2, gateway, domínios, parecer ANS).

*Vinculado a: `2026-07-comite-aprovacao.md`, `2026-07-docgrow-mvp-inovacoes.md`, `docgrow/MVP.md`.*
