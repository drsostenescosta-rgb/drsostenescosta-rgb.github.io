# Vertical de ensino médico · Pesquisa profunda + Blueprint MedVerse (jul/2026)

Pesquisa multi-agente. O blueprint abaixo (nome de trabalho "Atlas Med") foi adotado como **MedVerse** (`medverse/`). Avaliação do comitê em `2026-07-comite-aprovacao.md`.

## 1. Por que essa vertical explodiu no Brasil

- Escolas médicas: 143 (2004) → **448 (2024)**; 50 mil+ vagas/ano; **~287 mil estudantes** (+71% desde 2018).
- ~24 mil formandos/ano, mas vagas de residência cresceram só 26% → **o gargalo da residência é a maior dor monetizável**.
- 500 mil+ médicos ativos, projeção 1,15 milhão em 2035 → o "modo médico formado" dobra de tamanho em uma década.
- WhatsApp = infraestrutura nacional (~98% de penetração em mensageria).

## 2. Players internacionais (síntese)

| Player | Modelo/pricing | Lição-chave |
|---|---|---|
| **AMBOSS** | Assinatura US$ 8-15/mês + Qbank ~US$ 428/ano | Biblioteca↔questões hiperlinkadas: o aluno nunca sai do ecossistema |
| **UWorld** | US$ 319-719 por janela de tempo | **Explicação excelente é o produto**, não a questão; urgência temporal força intensidade |
| **Osmosis** (Elsevier) | Freemium; 8M estudantes | Vídeo curto + IA ancorada em livro-texto (resposta rastreável) |
| **Lecturio** | US$ 20-30/mês, 2 tiers + B2B faculdades | Trilha vídeo→conceito→quiz→banca com repetição espaçada nativa |
| **Anki/AnkiHub/AnKing** | Deck AnKing 30 mil+ cards, crowdsourcing diário; AnkiHub US$ 5-10/mês, 100 mil+ usuários | A maior ferramenta de retenção do mundo é comunitária: **integrar-se ao Anki, nunca competir** (exportação nativa) |
| **UpToDate** | 3M+ assinantes | Benchmark de confiança editorial (o que a OpenEvidence ataca) |
| **OpenEvidence** ⭐ | **Grátis p/ clínico verificado**, ads farma com CPM US$ 70-1.000; ARPU ~US$ 124; 757 mil clínicos; **valuation US$ 12 bi (jan/2026)** | Grátis para o profissional verificado + monetização B2B da audiência qualificada = o modelo que destravou adoção em massa |
| **Figure 1** | Rede social de casos, 2,5M usuários, 190 países | Verificação profissional + anonimização por design = os 2 pilares de rede médica viável |
| **Duolingo** (mecânica) | Streak 7d = **3,6x retenção**; ligas = +40% engajamento; DAUs 10x desde 2019 | A unidade gamificável da medicina é a **questão comentada** (curta, mensurável, feedback imediato) |

## 3. Players brasileiros

| Player | Pricing | Posição |
|---|---|---|
| Sanar/SanarFlix | desde R$ 24,50/mês; residência ~R$ 2.000/ano | Volume barato p/ graduação; atrito de cobrança no Reclame Aqui |
| Jaleko | R$ 39-59/mês + upsells modulares | Reforço de graduação; parcerias institucionais |
| Whitebook (Afya) | R$ 59,90/mês ou R$ 718,80/ano | Nº 1 em decisão clínica — mas é **consulta, não aprendizado** |
| Estratégia MED | extensivos R$ 5-8 mil/ano; banco avulso 200 mil+ questões (108 mil comentadas) | Máquina de conteúdo + disciplina |
| MedCof | R$ 3.997-5.497 | IA (CofBot) para personalizar rotina; marca forte entre internos |
| Medcel (Afya) | R$ 1.997-18.167 | Ecossistema Afya = concorrente estrutural mais perigoso (funil vertical completo) |

### ChagasAI — o alvo a superar (e onde ele é vencível)
- Startup do estudante piauiense Lucas Marques (Picos-PI); Whisper (aula→resumo), Chagas Insight (artigo→questões), Chagas Assistant (tira-dúvidas); 1.500+ assinantes; desde R$ 54,45/mês (bienal).
- **Fraquezas:** (1) é um *utilitário de conversão de conteúdo*, não um *sistema de aprendizado* (sem grafo de conhecimento, sem repetição espaçada orquestrada, sem banco oficial de bancas); (2) zero camada social/efeito de rede; (3) sem integração universitária; (4) sem trilha para o médico formado (LTV morre na formatura); (5) confiabilidade de fontes autodeclarada; (6) gamificação superficial.

### Ferramentas de pesquisa científica (nenhuma é brasileira!)
Consensus (US$ 9-15/mês, Consensus Meter), Elicit (US$ 10-49, pipeline de revisão sistemática), SciSpace (US$ 12-70, AI Writer), Scite (US$ 12-20, Smart Citations). **Vazio óbvio:** nenhuma indexa bem SciELO/LILACS/diretrizes MS, todas cobram em dólar → oportunidade do "Consensus brasileiro" dentro do MedVerse.

## 4. Os cinco vazios do mercado brasileiro

1. Ninguém une **consulta + aprendizado + comunidade** (Whitebook consulta, Estratégia ensina, ninguém conecta).
2. **Gamificação séria nível Duolingo inexiste** nos players médicos BR.
3. **A universidade está fora do loop** (ninguém integra notas, planos de ensino, agenda).
4. **O médico formado é órfão** de aprendizado contínuo estruturado em português.
5. **Pesquisa/escrita científica PT-BR com integridade por design** — vazio total.

## 5. Blueprint MedVerse

**Tese:** o companheiro de carreira médica da matrícula ao último dia de profissão — estudo gamificado + contexto universitário real + comunidade verificada + evidência rastreável. Melhor que o ChagasAI porque é um *sistema*, não um *utilitário*.

### Personas
- **P1 "Ana, 2º ano"** (básico, interior, paga R$ 30-50): perfil com avatar/foto, radar de competências, streak, liga, decks públicos.
- **P2 "Bruno, interno 5º ano"** (foco residência, usa Anki, 60+ candidatos/vaga): score preditivo por banca, percentil da coorte, currículo vivo.
- **P3 "Dra. Carla, 31, especialista"** (atualização sem tempo, artigo travado há 8 meses): CRM verificado, trilhas de atualização, artigos em andamento.
- **P4 "Prof. Diego, coordenador"** (B2B): dashboard de coorte, integração acadêmica, ENAMED.

### Fases
**MVP (0-8 meses) — "o hábito":** banco de questões gamificado (questões de provas públicas — sem proteção autoral (Lei 9.610/98 art. 8º; TJ-SP 2024) — com comentários 100% autorais + questões IA validadas por médicos com selo "revisado por humano"); mecânica Duolingo completa (streak com congelamento, XP, ligas semanais com matchmaking, metas, quests "Semana da Sepse"); explicações padrão-ouro alternativa por alternativa linkadas a cards de conceito (loop AMBOSS); **bot WhatsApp** (questão do dia 7h, lembrete de streak, resumo semanal); importador de conteúdo (PDF/áudio → resumo+flashcards+questões, paridade com ChagasAI em 1 feature) com **exportação para Anki**; perfil com badges compartilháveis no Instagram (aquisição orgânica).

**v2 (9-18 meses) — "contexto e comunidade":** integração universitária (Moodle/Canvas via LTI/API: plano de ensino, materiais, agenda de provas, notas → cronograma se monta sozinho; fallback: upload de PDF + parsing IA); rede social de estudo validada (modelo Figure 1 + StackOverflow: reputação, selo de revisão por pares, casos com anonimização assistida por IA + checklist de consentimento); mural de ligas acadêmicas/extensão/estágios com "currículo vivo"; simulados com percentil real; duelos 1v1 e decks colaborativos versionados (modelo AnkiHub).

**v3 (18-36 meses) — "a carreira inteira":** modo médico formado (trilhas de procedimentos com vídeo+checklist, protocolos vivos MS/sociedades com "o que mudou", **radar de evidência** PubMed/SciELO/LILACS/Cochrane com resumo crítico PT-BR e nível de evidência — *sem fonte, sem resposta*); **Laboratório de Artigos com integridade por design** — a IA FAZ: estrutura IMRaD, busca/organização de referências via API, tabelas de extração, revisão, formatação Vancouver/ABNT, checklists EQUATOR, tradução; a IA NUNCA FAZ: gerar dados/resultados/estatísticas, criar citações (**toda referência é verificada contra a base real**); log de proveniência + parágrafo de disclosure ICMJE/COPE automático; ferramenta de pergunta clínica em PT-BR com corpus nacional (o "Consensus brasileiro").

### Receita
| Camada | Preço-alvo | Racional |
|---|---|---|
| Free | 20 questões/dia, streak, liga | Motor de aquisição (Duolingo/OpenEvidence) |
| Estudante | R$ 39,90/mês | Entre SanarFlix (24,50) e Jaleko (59); abaixo do ChagasAI com 10x o produto |
| Residência | R$ 119-149/mês | 4-6x mais barato que extensivos, atacando por baixo |
| Pro (formado) | R$ 59,90/mês | Pareado com Whitebook entregando aprendizado + artigos |
| Institucional B2B | R$ 15-30/aluno/mês | Dashboard do coordenador; financia os conectores |
| Audiência (fase 3) | CPM premium sobre audiência verificada por CRM | Playbook OpenEvidence (ARPU US$ 124); rotulagem clara, CFM/Anvisa |

### Riscos e mitigação
LGPD (dados acadêmicos sensíveis → DPO, consentimento granular, minimização, servidores no Brasil); integridade acadêmica (guarda-corpos técnicos + posicionar como ANTI-fraude); direitos autorais (só enunciados oficiais + comentários próprios; nunca raspar concorrentes); alucinação clínica (RAG restrito a fontes curadas, citação obrigatória); Afya (velocidade + comunidade aberta multiescola + B2B com faculdades não-Afya); WhatsApp (canal de reativação, nunca única interface).

### Métricas norte
Estrela-guia: *questões respondidas com explicação lida/usuário ativo/semana*. Streak ≥7d >30% dos DAU; D30 >40%; conversão free→paid >5%; churn <4%; ≥50% signups orgânicos; ano 2: estudo interno de desempenho (a métrica que vende); integridade: 100% de referências fabricadas bloqueadas.

## Fontes (principais)

AMBOSS: amboss.com/us/pricing · UWorld: medical.uworld.com · Osmosis: osmosis.org/plans/md · Lecturio: lecturio.com/medical/pricing · AnkiHub: ankihub.net · UpToDate: wolterskluwer.com/en/solutions/uptodate · OpenEvidence: cnbc.com (US$ 12 bi, jan/2026) · sacra.com/c/openevidence · Figure 1: figure1.com · Duolingo: trophy.so/blog/duolingo-gamification-case-study · Sanar: sanarflix.com.br/assine · Jaleko: jaleko.com.br · Whitebook: pebmed.zendesk.com · Estratégia MED: med.estrategia.com · MedCof: grupomedcof.com.br · Medcel: medcel.com.br · ChagasAI: chagas.ai · techtudo.com.br (nov/2025) · Consensus/Elicit/SciSpace/Scite: sites oficiais · Demografia: medicinasa.com.br/educacao-edicao32 · TJ-SP questões de prova: conjur.com.br (abr/2024) · ICMJE: icmje.org · COPE: publicationethics.org.
