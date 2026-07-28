# ATA DO COMITÊ DE APROVAÇÃO DE IMPLEMENTAÇÃO — ECOSSISTEMA ZATHEON

**Data:** 28/07/2026 · **Local:** revisão documental do repositório `drsostenescosta-rgb.github.io`
**Presentes:** CEO Cético (foco/caixa) · Investidor VC (mercado/timing) · Advogado Regulatório (CFM/ANS/LGPD) · Head de Produto (execução/retenção)
**Documentos examinados:** benchmark Treint, benchmark global (10 players), pesquisa de ensino médico, visão 5 anos, especificação dos 3 produtos, estudo de naming, PLANO-MKT-2026, BACKLOG do MedGroth.
**Filosofia da casa aplicada:** só aprova o que tem sucesso JÁ ESTABELECIDO em outro mercado E melhoria clara nossa.

**Constatação preliminar do comitê (unânime e dura):** o repositório mostra planejamento de qualidade acima da média — e **zero clientes pagantes**. O SQL do Sprint 1 do BACKLOG ainda não foi rodado; a captura de leads não grava 100% no banco. O comitê avalia planos de quem ainda não provou o funil básico. Toda a ata deve ser lida sob essa luz.

---

## 1. Metodologia de pontuação

Cada item recebe 5 notas de 0 a 10:

| Critério | Peso | Pergunta |
|---|---|---|
| **Inovação relativa** | 15% | Melhora algo já validado (não reinventa a roda)? |
| **Sucesso estabelecido** | 25% | Força da evidência de benchmark em outro mercado |
| **Viabilidade solo/bootstrapped** | 25% | Um médico solo, sem funding, com GitHub Pages + Supabase + Vercel, executa? |
| **Impacto em receita 12 meses** | 25% | Move o caixa até jul/2027? |
| **Risco regulatório invertido** | 10% | 10 = sem risco; 0 = risco existencial |

**Score final** = média ponderada. **≥ 7,0 = APROVADO** · **5,5–6,9 = APROVADO COM CONDIÇÕES** · **< 5,5 = ADIADO**.

---

## 2. Avaliação dos 3 produtos

| Produto | Inovação | Sucesso estab. | Viabilidade | Impacto 12m | Risco inv. | **Score** | **Decisão** |
|---|---|---|---|---|---|---|---|
| **DocGrow** | 6 | 9 | 8 | 8 | 7 | **7,85** | ✅ APROVADO |
| **CareLoop** | 8 | 9 | 6 | 6 | 4 | **6,85** | ⚠️ APROVADO COM CONDIÇÕES |
| **MedVerse** | 8 | 8 | 3 | 3 | 6 | **5,30** | ⛔ ADIADO |

### 2.1 DocGrow — 7,85 · APROVADO

**CEO Cético:** É o único dos três com produto no ar, funil desenhado e backlog acionável — aprovo, mas com raiva: por que estamos discutindo dois produtos novos quando o Sprint 1 do produto que já existe está parado? A nota 8 de viabilidade só vale se o fundador tratar DocGrow como O produto, não como um terço da atenção. Nota 6 em inovação porque é essencialmente o MedGroth com nome novo — o que, aliás, é exatamente o que eu quero: menos invenção, mais venda. Condição informal: nenhuma linha de código de outro produto antes de 5 médicos reais percorrerem o funil completo.

**Investidor VC:** A tese "crescimento + operação" é categoria validada de US$ 1 bi (Tebra), com Doctolib e Docplanner provando o modelo de assinatura do médico na Europa. O timing da visão 5 anos está correto: a janela 2026–2028, antes de os incumbentes embutirem IA, é real. Ressalva: o fosso declarado ("método + recorrência + dados de funil") ainda é hipótese — os dados proprietários de funil não existem com 0 clientes. Investível como produto-âncora; não investível como um de três.

**Advogado Regulatório:** Risco moderado e bem mapeado. A Res. CFM 2.336/2023 liberalizou publicidade, mas os scripts de IA do Sprint 3 precisam de filtro obrigatório contra promessa de resultado, superlativos e antes/depois fora das hipóteses. Telemedicina "centralizada" exige fluxo de consentimento nativo (Res. 2.314/2022) antes do primeiro vídeo, não depois. LGPD: rodar a migração RLS é pré-condição de qualquer campanha de captura — hoje há lead ficando só em localStorage.

**Head de Produto:** O melhor ativo é a retenção por resultado visível: o relatório "sua clínica este mês" e o dashboard "quanto o produto te gerou em R$" devem ser a tela inicial (lição do churn fatal do Zocdoc). Sprint 1 → Sprint 2 são as únicas coisas que importam nos próximos 60 dias. Objeção: confirmação de no-show WhatsApp e coleta de reviews Google (recomendações 3 e 4 do benchmark global, ROI comprovado) não estão em nenhum sprint — incluir no Sprint 3 no lugar de features mais glamourosas.

### 2.2 CareLoop — 6,85 · APROVADO COM CONDIÇÕES

**CEO Cético:** A ideia é a melhor do portfólio e é exatamente por isso que voto por segurá-la. Recorrência só vende para médico que já tem demanda — CareLoop é *upsell* de cliente DocGrow, não produto de aquisição. Condição: CareLoop nasce como **módulo/piloto dentro da base DocGrow**, com 3 a 5 médicos, e só ganha landing, marca e vagas fundadoras próprias depois do piloto. Um fundador solo não sustenta dois funis de venda.

**Investidor VC:** Benchmark fortíssimo — Hint Health com 1M+ pacientes assinantes, Ping An provando assinatura com margem via triagem; o vazio brasileiro é real. Pix recorrente + WhatsApp é melhoria genuína. Mas a lição da Hint que o plano não internaliza: **vende-se o movimento, não o software** — a evangelização compete pelo mesmo tempo do fundador. Aprovo como aposta nº 2, sequenciada.

**Advogado Regulatório:** ⚠️ **Item de maior risco jurídico da mesa; objeção formal ao lançamento sem as condições abaixo.** A Lei 9.656/98 e a ANS tratam como operação irregular qualquer arranjo com rede de terceiros, garantia de cobertura futura ou intermediação de risco — "assinatura de cuidado" mora na zona cinzenta. Condições **vinculantes**: (1) parecer jurídico formal ANTES do primeiro contrato; (2) contrato-modelo restrito a serviços do próprio médico contratante, sem promessa de cobertura, sem caixa comum, com cancelamento livre; (3) proibição absoluta dos termos "plano", "cobertura", "mensalidade de saúde" em produto e marketing; (4) cláusula de que o CareLoop é ferramenta de gestão/cobrança, nunca parte da relação assistencial; (5) monitoramento trimestral de súmulas ANS. LGPD: adesão a protocolos é dado de saúde sensível — base legal e RIPD antes do piloto. Cumpridas as cinco, retiro a objeção.

**Head de Produto:** Produto certo, momento errado se standalone. Depende de o médico já ter protocolos precificados e pacientes em volume — ambos entregues pelo DocGrow. Como módulo, o custo é baixo: a infra de cobrança do Sprint 2 serve aos dois lados. Métrica de ativação do piloto: **médico com ≥5 pacientes assinantes ativos em 60 dias**. O dashboard MRR/churn/LTV do médico é a alma da retenção (lição Hint).

**Condições consolidadas:** parecer jurídico ANS prévio e vinculante + nascer como módulo da base DocGrow com piloto de 3–5 médicos + gatilho de graduação para standalone: 5 médicos com ≥5 assinantes pagantes cada e parecer publicado.

### 2.3 MedVerse — 5,30 · ADIADO

**CEO Cético:** ADIADO sem constrangimento. Um médico solo, com consultório, tocando funil do DocGrow e piloto jurídico do CareLoop, não constrói simultaneamente banco de questões padrão-ouro, gamificação nível Duolingo, bot WhatsApp e rede social — o próprio MVP do blueprint se dá 8 meses com dedicação integral. A "anti-ideia" do benchmark Treint diz textualmente: *amplitude sem profundidade com 4-5 produtos rasos e sem funding é o padrão que queimou a Treint*. Estamos a uma decisão de repetir o erro que documentamos. O ecossistema precisa de caixa, não do MedVerse, em 2026.

**Investidor VC:** Mercado real e bem pesquisado (287 mil estudantes, OpenEvidence a US$ 12 bi) e o ChagasAI é vencível. Mas é um **negócio diferente** — B2C low-ticket, motor de conteúdo, contra Afya e Estratégia MED capitalizados — sem canal, persona nem motor de vendas compartilhados com DocGrow/CareLoop. Melhor ideia para o ano 2 ou 3, ou para quando houver cofundador dedicado. Guardem a pesquisa, registrem a marca, adiem o produto.

**Advogado Regulatório:** Risco médio; blueprint juridicamente maduro (questões de provas públicas com comentários autorais — art. 8º Lei 9.610/98, TJ-SP 2024; Laboratório de Artigos alinhado a ICMJE/COPE). Atenções futuras: dados acadêmicos sensíveis (LGPD, possíveis menores de idade no 1º ano); monetização farma exigirá rotulagem CFM/Anvisa e separação editorial.

**Head de Produto:** A qualidade da pesquisa esconde o problema de execução: "explicação padrão-ouro alternativa por alternativa" é **operação de conteúdo intensiva**, não software (UWorld provou que a explicação É o produto). Sem isso, o MedVerse nasce igual ao ChagasAI que pretende superar. Condições para desadiar: (1) DocGrow com MRR ≥ R$ 30 mil e churn < 3% por 2 meses consecutivos, OU cofundador dedicado; (2) teste de fumaça autorizado desde já — bot WhatsApp "questão do dia" com meta de 500 usuários e retenção D30 > 40% (é medição, não produto).

---

## 3. Plano de marketing e roadmap 5 anos

### 3.1 PLANO-MKT-2026 — Score 7,60 · ✅ APROVADO (4 observações vinculantes)

| Inovação | Sucesso estab. | Viabilidade | Impacto 12m | Risco inv. | **Score** |
|---|---|---|---|---|---|
| 7 | 8 | 8 | 7 | 8 | **7,60** |

Segue a filosofia da casa: copia funil validado (founder-led + aplicação curada) e melhora a fraqueza do benchmark (**preço público** — decisão unânime). Observações: (1) Sprint 1 é bloqueador de TODO o calendário — zero Meta Ads antes; (2) meta de 5 mil seguidores em 90 dias é fantasia → revisada para **1.500 seguidores e 30 diagnósticos/mês**; (3) "resposta em <1h no WhatsApp" quebra — definir janelas fixas + automatizar primeira resposta; (4) casos antes/depois devem ser de **receita/gestão do consultório** (permitido), jamais de resultado clínico de pacientes (vedado pela 2.336/2023); consentimento escrito arquivado.

### 3.2 Roadmap 5 anos — Score 6,50 · ⚠️ APROVADO COM CONDIÇÕES

| Inovação | Sucesso estab. | Viabilidade | Impacto 12m | Risco inv. | **Score** |
|---|---|---|---|---|---|
| 7 | 7 | 6 | 6 | 7 | **6,50** |

Elogios: análise de janela 2026–2028, decisão de NÃO competir como scribe, tabela de blindagem regulatória (a melhor peça jurídica do repositório), regra de ouro do churn < 3%. Condições: (1) meta 2026 rebaixada de 120 clientes/R$ 30 mil MRR para **40–60 clientes / MRR R$ 12–18 mil** (24 fechamentos/mês solo é irreal), com replanejamento da curva 2027+ se dezembro fechar abaixo de 30; (2) roadmap 2027 condicionado ao gatilho do CareLoop (§2.2); (3) 2028+ (MedEasy, FHIR/RNDS, take rate) é pauta do comitê de 2027 — autorizado apenas modelar dados novos compatíveis com FHIR quando não custar nada; (4) testar cobrança por resultado/take rate com 2–3 fundadoras ainda em 2026 como hedge do cenário pessimista.

---

## 4. Validação do naming

| Marca | Parecer | Decisão |
|---|---|---|
| **Zatheon** (holding) | Distintiva, internacionalizável, juridicamente forte por ser fantasiosa. Não gastar marketing nela em 2026 — é marca de contrato social e rodapé. | ✅ Confirmada |
| **DocGrow** | Clareza vence em fase de tração; prefixo "Doc" consagrado. **Launch: veto mantido** (inregistrável, sem contexto). **DocVibeCode: veto mantido** (modismo fora da persona — um médico de 45 anos não compra "vibe code"). | ✅ Confirmada |
| **CareLoop** | Acerto duplo: comunica ciclo contínuo e **evita semanticamente o vocabulário de plano de saúde** — o naming é peça de blindagem ANS, não só branding. | ✅ Confirmada |
| **MedVerse** | Conceito bom, maior risco de colisão do portfólio ("med+verse" é construção óbvia). Produto adiado → busca INPI e de mercado ANTES de divulgação pública da marca. | ⚠️ Condicionada a anterioridade limpa |
| **Pendências** | INPI classes 9/42/44, domínios e handles viram **bloqueador de 30 dias**: registrar domínios disponíveis esta semana; buscas INPI antes de material público. | Prazo: 31/ago/2026 |

---

## 5. Veredicto final

### 5.1 Ordem de implementação

**AGORA (ago–out/2026) — frente única:**
1. Sprint 1 do BACKLOG completo (SQL, painel de leads, notificação, analytics) — bloqueador de tudo.
2. Plano de marketing com metas revisadas; 5 médicos reais no funil em setembro.
3. Sprint 2 (auth + cobrança) — destrava receita E é a infra que o CareLoop reutiliza.
4. Registro de domínios + buscas INPI das 4 marcas.
5. Paralelo permitido por ser barato: encomendar já o parecer jurídico ANS do CareLoop.

**DEPOIS (nov/2026–1º sem. 2027) — mediante gatilho:**
- CareLoop como módulo-piloto com 3–5 fundadoras → **gatilho: 10 clientes pagantes DocGrow + parecer ANS entregue.**
- Sprint 3 (IA `/api/groth` com filtro CFM) + confirmação de no-show e coleta de reviews Google.
- Landing internacional DocGrow só depois de 2 casos documentados.

**SÓ APÓS MÉTRICA X:**
- **CareLoop standalone:** 5 médicos com ≥5 pacientes assinantes cada.
- **MedVerse:** DocGrow com MRR ≥ R$ 30 mil e churn < 3% por 2 meses, OU cofundador dedicado. Teste de fumaça (bot "questão do dia": 500 usuários, D30 > 40%) autorizado desde já.
- **MedEasy / FHIR / take rate / verticais:** pauta do comitê de 2027.

### 5.2 Os 5 riscos que matam o plano — e o guard-rail de cada um

| # | Risco | Por que mata | Guard-rail |
|---|---|---|---|
| 1 | **Dispersão do fundador solo** (o padrão que queimou a Treint) | Nenhum produto atinge profundidade; caixa não chega | Regra de frente única com gatilhos de métrica; revisão mensal desta ata contra o commit log |
| 2 | **Enquadramento ANS do CareLoop** | Risco existencial: multa, interdição, contaminação reputacional | As 5 condições do advogado são vinculantes; vocabulário proibido auditado em todo copy |
| 3 | **Funil de papel** (captura fora do banco + SLA impossível) | Queima a audiência founder-led sem gerar pipeline | Sprint 1 bloqueador absoluto; zero mídia paga antes de 5 médicos ponta a ponta |
| 4 | **Churn por valor invisível** (lição Zocdoc) | MRR vira peneira; a curva de 5 anos desmorona | Dashboard "quanto o produto te gerou em R$ este mês" como tela inicial desde o Sprint 2 |
| 5 | **Comoditização da IA 2027–2028** | Diferencial percebido evapora antes de a base existir | Ancorar no que não comoditiza: método + recorrência + benchmark proprietário de funil |

### 5.3 As 3 métricas exigidas no próximo ciclo (revisão: outubro/2026)

1. **Funil vivo e medido:** ≥ 30 diagnósticos concluídos/mês com lead→conversa ≥ 40%, gravados no Supabase.
2. **Receita real:** ≥ 10 clientes pagantes com cobrança recorrente ativa — não cartas de intenção.
3. **Retenção precoce:** 100% das fundadoras ativas na semana 4 do onboarding e churn zero no trimestre; um único cancelamento exige post-mortem escrito.

Métrica de integridade adicional: parecer ANS encomendado e busca INPI protocolada até a reunião de outubro.

---

**Encerramento.** O comitê aprova a estratégia e reprova a simultaneidade. A filosofia da casa foi respeitada no papel — todos os produtos têm benchmark forte e melhoria clara — mas a casa não vive de papel: vive do SQL que ainda não foi rodado. Ordem do dia até outubro: **um produto, um funil, dez pagantes.**

*Ata lavrada em 28/07/2026. Revisão: primeira quinzena de outubro/2026, condicionada às métricas do §5.3.*
