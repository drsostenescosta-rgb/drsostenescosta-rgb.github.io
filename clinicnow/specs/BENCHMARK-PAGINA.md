# BENCHMARK → Página de vendas ClinicNow (remodelagem 2026-07-29)

**Status:** implementado em `clinicnow/index.html` nesta rodada.
**Fontes:** ordem do Founder (2 benchmarks); doutrina founder-100x; L5 (oferta NÃO muda: Start R$ 297 / Pro R$ 697 / Aceleração R$ 997 por mês em cobrança anual, mentoria + suporte incluídos), L3 (testes), L10.

## 0 · Nota de método (honestidade sobre a coleta)

O proxy de rede desta sessão **negou por política** o acesso direto a `www.mdhub.ai`, `treint.vercel.app`, `treint.com` e a espelhos (Wayback, r.jina.ai) — falha `CONNECT 403` registrada no status do proxy. A extração abaixo veio do **fallback autorizado (WebSearch)**: títulos, descrições e trechos indexados das próprias páginas, da página YC do mdhub, de diretórios de review (aipure, elion.health) e das páginas institucionais do Treint (treint.com / treintbusiness.com). **Conteúdo textual é confiável; a ordem exata das seções é parcialmente inferida** dos trechos e do padrão YC-style — está marcada como (inferido) onde for o caso. Nenhuma frase deles foi copiada: vendem outro produto, em outra língua; clonamos o MODELO, não o texto.

## 1 · Benchmark A — mdhub.ai/products/emma ("Emma", YC-style)

**Título real da página:** "Meet Emma, your Clinical Assistant — Focus On Care, Not Paperwork."

**Estrutura extraída (ordem inferida do padrão + trechos):**
1. Hero: persona nomeada ("Emma") + promessa emocional curta ("focus on care, not paperwork") + CTA de demo.
2. Prova social imediata: logos/casos (Talkiatry, Amen Clinics operam sobre a infra deles).
3. Mecanismo em 3 fases: **antes / durante / depois** da sessão (pre-charting → notas → códigos CPT/ICD-10).
4. Números pequenos e concretos por feature: nota em **30 segundos**, economiza **2+ horas/dia**, revisão e assinatura em **menos de 60 segundos**, setup em **30 segundos**, formatos DAP/SOAP/BIRP.
5. "Funciona com o que você já usa": roda ao lado do EMR existente, sem troca de plataforma.
6. Segurança/conformidade como seção própria: HIPAA, SOC 2 Type II, criptografia, BAA, monitoramento (Drata).
7. Cross-sell do ecossistema: outros "AI workers" nomeados — Sarah (admissões, **+30%** agendamentos), Eric (billing, **−50%** overhead).
8. CTA final: "Book a demo". **Preço: escondido — só via demo.**

**Argumentos centrais:** tempo devolvido ao clínico; documentação como fardo; números pequenos, específicos e verificáveis; persona com nome humaniza IA; conformidade como argumento de venda; ecossistema (um worker puxa o outro).

**Keywords/vocabulário:** AI clinical assistant, AI scribe, clinical documentation, notes in 30 seconds, save 2 hours per day, HIPAA compliant, SOC 2, before/during/after, pre-charting, CPT coding, behavioral health, focus on care.

**Padrão de CTA:** um único CTA dominante (demo), repetido; sem preço; fricção de vendas alta e assumida.

**Tom:** clínico-profissional, calmo, numérico, frases curtas, alívio ("focus on care").

## 2 · Benchmark B — treint.vercel.app ("Treint — Treatment Intelligence")

**Tagline real:** "Stay on top of your health game."

**Estrutura/conteúdo extraído:**
1. Hero aspiracional com tagline de "jogo de saúde" + CTA de app.
2. Super-app tudo-em-um, lista longa de módulos: agendamento (físico/virtual, a qualquer hora), portal do paciente, prontuário familiar, telemedicina, marketplace de planos de tratamento, lembretes de medicação, exames em casa, busca de médicos/hospitais, comunicação médico-paciente, Smart Diagnosis.
3. Números percentuais grandes por benefício (páginas business): **+40%** de receita com marketplace, **+20%** consultas via telemedicina, **+80%** agendamento online.
4. Dois públicos na mesma narrativa (paciente e provedor).
5. Conformidade citada em lista: HIPAA, GDPR, padrões locais.
6. IA como guarda-chuva: "predictive analytics, automated workflows, tailored treatment plans".
7. Preço: **ausente/sob consulta.**

**Argumentos centrais:** ecossistema completo ("um app para tudo"), empoderamento do usuário, números de impacto por módulo, tecnologia como diferencial.

**Keywords:** treatment intelligence, health game, appointment scheduling, telemedicine, patient portal, treatment plans, marketplace, AI-powered, predictive analytics.

**Tom:** energético, aspiracional, gamificado; promessas percentuais agressivas **sem premissas visíveis** (anti-modelo para nós).

## 3 · Mapa de transposição (benchmark → ClinicNow → o que melhoramos)

| Seção do benchmark | Equivalente ClinicNow | O que MELHORAMOS |
|---|---|---|
| Hero Emma: promessa emocional + CTA demo | Hero: "Você aprendeu a cuidar. Ninguém te ensinou a crescer." + CTA diagnóstico | Nosso CTA primário entrega valor NA HORA (diagnóstico em 3 min, sem call de vendas); o deles agenda uma demo com vendedor |
| Logos de clientes (Talkiatry/Amen) | **Barra de fatos do sistema** (`#fatos`) | Não temos logos e não alugamos: barra com números verificáveis do produto (3 min, 7 perguntas, 4 semanas, preço na página, 7 dias CDC) + declaração explícita de que estamos em beta fundador |
| — (nenhum dos dois nomeia a dor por profissão) | Seção de dor por vertical (`#dor`) | Mantida: dor nomeada por 8 verticais é vantagem nossa sobre ambos |
| Mecanismo antes/durante/depois (Emma) | Método Diagnóstico → Plano → Execução → Recorrência (`#metodo`) | Fases numeradas com números concretos estilo Emma (3 min, 7 perguntas, 4 semanas, 2 h/semana) |
| Demo agendada com vendedor | **Produto aberto** (`#demo`) | Ponto cego virado do avesso: em vez de "book a demo", o cockpit real é acessível no navegador, sem cartão e sem call |
| Lista de features (Treint) / specs de feature (Emma) | O que você recebe (`#recebe`) | Mantida, com o combinado honesto (o que mentoria/suporte NÃO são) |
| Ecossistema de workers nomeados (Emma+Sarah+Eric) | **Ecossistema ClinicNow + MedEasy** (`#ecossistema`) | MedEasy apresentado como módulo do ecossistema: prova de valor clínica (Índice de Saúde), integração em implantação com selo "em breve" (L5: nada prometido antes da v1) |
| Percentuais agressivos sem premissa (Treint) | **Calculadora honesta** (`#roi`) | Anti-modelo corrigido: aritmética sobre premissas do PRÓPRIO usuário, editáveis e visíveis, com aviso de que é estimativa, não previsão |
| — (nenhum se compara a alternativas) | **Comparativo vs. agência vs. curso vs. sozinho** (`#comparativo`) | Inclui a linha "quando a agência é a melhor escolha" — honestidade que nenhum benchmark tem |
| — | Para quem é / não é (`#paraquem`) | Mantida (nenhum benchmark diz para quem NÃO é) |
| Preço escondido (ambos) | **Planos com preço e total anual na página** (`#planos`) | Oferta L5 intacta (297/697/997 mês, cobrança anual, totais visíveis) + microcopy "por que o preço está na página" |
| — | Garantia CDC 7 dias (`#garantia`) | Mantida (nenhum benchmark tem garantia explícita) |
| HIPAA/SOC 2 badges (Emma) | **Conformidade BR** (`#conformidade`) | Transposto ao nosso mercado: LGPD visível + publicidade em saúde por conselho (CFM/COFFITO/COREN/CFN/CFO/CFBM) + nota anti-selo-falso ("não exibimos certificação que não temos") |
| Depoimentos/casos | História real do fundador (`#prova`) | Sem depoimento fake: quote e trajetória reais de quem constrói |
| FAQ (padrão YC) | FAQ (`#faq`) | Mantida com objeções reais (preço, mentoria, conselho, cancelamento) |
| CTA final "book a demo" | CTA final: diagnóstico + produto por dentro | Fricção mínima honesta |

## 4 · Pontos cegos escolhidos (nenhum dos dois faz) — 5 implementados

1. **Preço transparente na página** (ambos escondem) — já tínhamos; agora com argumento explícito na seção de planos.
2. **Demo interativa do produto real** (`#demo`) — nosso app é acessível; o deles é demo agendada.
3. **Calculadora de ROI honesta** (`#roi`) — premissas visíveis e editáveis; o Treint joga percentuais sem premissa.
4. **Comparativo com as alternativas reais** (`#comparativo`) — incluindo quando NÃO somos a melhor escolha.
5. **Conformidade regulatória por conselho + LGPD visível** (`#conformidade`) — a versão BR do bloco HIPAA/SOC 2, sem selo inventado.

(6. Garantia explícita e limites honestos da oferta já existiam — mantidos e reforçados.)

## 5 · Keywords adaptadas ao mercado PT-BR

Do vocabulário deles ("clinical documentation", "save 2 hours", "treatment intelligence") para o nosso problema (crescimento de clínica): **captação de pacientes, marketing para clínicas, crescimento de clínica, agenda previsível, CRM para clínicas, funil de pacientes, receita recorrente, protocolo, precificação de consulta, gestão de clínica, LGPD, publicidade médica ética**. Aplicadas em `<title>`, meta description e headings do index.

## 6 · Vetos respeitados

- Nenhum texto literal dos benchmarks (produto e língua diferentes; plágio = veto).
- Sem promessa de resultado, sem depoimento inventado, sem logo alugado, sem escassez falsa.
- Oferta inalterada (L5): 297/697/997 por mês em cobrança anual; totais 3.564/8.364/11.964; mentoria + suporte em todos os planos.
- MedEasy no ecossistema com selo "em breve" até a v1 da integração (SPEC-MEDEASY-CLINICNOW.md).
