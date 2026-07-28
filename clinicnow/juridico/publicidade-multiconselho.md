# Publicidade multiconselho — regras para o motor de texto do MedGroth (ICP ampliado)

> Minuta/análise gerada por IA — exige revisão de advogado humano licenciado antes de uso real.
> Complementa `medgroth/juridico/revisao-cfm.md` (que cobre só medicina). Data-base: 2026-07-28.

## Princípio de arquitetura: a regra do conselho mais restritivo vence

O MedGroth agora gera texto para 7+ perfis profissionais. Não é viável (nem seguro) manter um motor de texto por conselho na v1. **Decisão recomendada:** todo texto sugerido pelo produto deve passar no filtro do conselho MAIS restritivo em cada tema. O que o CFN proíbe para nutricionistas, o motor não sugere para ninguém — a menos que o produto saiba a profissão do usuário e libere por perfil (feature futura). Custo: textos um pouco mais conservadores. Benefício: zero risco de industrializar infração ética e coerência com a tese "venda ética".

**Pré-requisito de produto (obrigatório):** o onboarding deve perguntar a profissão e o registro (conselho + número). Sem isso, nenhuma liberação por perfil é possível e o escopo de atos (ver `checklist-icp-amplo.md`) fica sem controle.

---

## 1. CFM — Medicina (baseline, já revisado)

Base: Res. CFM 2.336/2023 (publicidade) e Código de Ética Médica (Res. CFM 2.217/2018, Cap. XIII).
Resumo do que já vale: sem promessa/garantia de resultado; sem sensacionalismo; identificação nome + CRM + RQE; preço de consulta pode; antes/depois só educativo, sem promessa, com autorização. Ver `revisao-cfm.md` para os achados aplicados ao produto.

## 2. COFFITO — Fisioterapia

**Base legal:** Código de Ética e Deontologia da Fisioterapia — Res. COFFITO 424/2013 (art. 9º, VI: divulgar serviços "de forma compatível com a dignidade da profissão e a leal concorrência"). Cartilhas de publicidade dos CREFITOs (ex.: CREFITO-4, 2023/2025) detalham a aplicação.

**O que muda vs CFM (regra clara + interpretação consolidada dos CREFITOs):**
- **Promoções, "pacotes de sessões", descontos percentuais e preços promocionais são tratados como mercantilização e concorrência desleal.** Isto é MAIS restritivo que o CFM (que permite divulgar preço de consulta). *Classificação: o art. 9º, VI é regra clara; a leitura de que "pacote com desconto" viola o dispositivo é interpretação consolidada em cartilhas e circulares dos CREFITOs — não é lei, mas é o que o fiscal aplica.*
- Vedado usar títulos genéricos no lugar de "fisioterapeuta" (art. 30 — "terapeuta corporal", "quiropraxista" etc.). O motor não deve sugerir apelidos de posicionamento que escondam a profissão.

**Impacto direto no MedGroth:** o coração do produto é "empacotar protocolos". Para fisioterapeutas, **não pode assim** ("pacote 10 sessões com 20% off", "promoção de avaliação"), **pode assado**: "programa de reabilitação com escopo, frequência e reavaliações definidas, valor informado de forma sóbria, sem desconto-relâmpago nem urgência". Programa clínico estruturado ≠ pacote promocional — a diferença é a linguagem de varejo, e o motor controla a linguagem.

## 3. COFEN/COREN — Enfermagem

**Base legal:** Código de Ética dos Profissionais de Enfermagem — Res. COFEN 564/2017 (art. 53: resguardar preceitos éticos e legais "quanto ao conteúdo e imagem veiculados nos diferentes meios de comunicação e publicidade"; há capítulo próprio de proibições). Lei 7.498/1986 (exercício da enfermagem — escopo de atos). Atuação do enfermeiro em estética: normatizada pelo COFEN (Res. 529/2016 e atualizações — **numeração e vigência a confirmar pelo advogado humano**).

**O que muda vs CFM:**
- As vedações de publicidade são menos detalhadas que as do CFM (interpretação: o COFEN remete a "preceitos éticos e legais" de forma aberta, o que na prática puxa o padrão CFM/CDC).
- **O risco dominante aqui não é a publicidade, é o escopo:** enfermeiro prescreve apenas no âmbito de programas/protocolos institucionais (Lei 7.498/1986, art. 11 — regra clara). Publicidade de enfermeiro oferecendo "protocolo de emagrecimento com prescrição" é infração de exercício profissional antes de ser infração publicitária.

**Impacto no MedGroth:** os protocolos sugeridos (ex.: "Emagrecimento 90d", "Saúde mental") não podem ser oferecidos tal como escritos a um enfermeiro — precisam de variante por escopo ("acompanhamento de enfermagem", "consultoria em cuidados", procedimentos estéticos autorizados pelo COFEN).

## 4. CFN — Nutrição (o conselho MAIS restritivo; atenção à norma nova de 2026)

**Base legal:** Res. CFN 599/2018 (Código de Ética e de Conduta do Nutricionista) — **revogada pela Res. CFN 856, de 25/04/2026**, que entra em vigor 90 dias após a publicação (ou seja, vigência começando agora, ~jul/2026). O produto deve nascer conforme a norma nova.

**Regras claras:**
- **"Antes e depois" é PROIBIDO**, mesmo com autorização por escrito do paciente: vedado divulgar imagem corporal de si ou de terceiros atribuindo resultados a produtos, equipamentos, técnicas ou protocolos (599/2018; a 856/2026 **amplia** a restrição para divulgação de resultados de pacientes em geral, com exceção apenas para ambiente técnico-científico — aulas, congressos, publicações acadêmicas). *Numeração exata do artigo na 856/2026: confirmar no texto oficial (na 599/2018 a vedação é citada como art. 55/58 conforme a fonte — conferir).* 
- Vedada promessa de resultado e uso de títulos/especialidades não reconhecidos pelo sistema CFN/CRN.

**O que muda vs CFM:** o CFM permite antes/depois educativo com condições; **o CFN proíbe e a norma de 2026 apertou ainda mais (inclui depoimentos/relatos de resultado de pacientes)**. É o teto de restrição do filtro único.

**Impacto no MedGroth:** qualquer feature de "prova social" (item 4 da revisão CFM) deve ser **bloqueada por padrão** no perfil nutricionista e, pelo princípio do mais restritivo, não deve ser sugerida genericamente a ninguém. "Não pode assim, pode assado": em vez de resultado de paciente, o motor sugere prova de método — formação, protocolo de acompanhamento, frequência de reavaliação, conteúdo educativo.

## 5. CFO — Odontologia

**Base legal:** Código de Ética Odontológica — Res. CFO-118/2012 (Cap. XVI, arts. 43-44: anúncio, propaganda e publicidade) e Res. CFO-196/2019 (flexibilizou imagens).

**Regras claras:**
- Publicidade deve conter **nome e nº de CRO**; especialidade só se registrada.
- **Res. 196/2019 permite "antes e depois"**, mas só: (i) pelo próprio profissional que realizou o procedimento; (ii) com autorização formal por escrito do paciente (TCLE); (iii) sem promessa de resultado; e (iv) **não vale para clínicas/pessoas jurídicas** — divulgação por PJ é publicidade comercial vedada. Selfies com paciente: só com TCLE.
- Continua vedado expor a realização de procedimentos e tecidos biológicos.
- **Historicamente o CEO/CFO veda anunciar preços, formas de pagamento, gratuidade e modalidades de comercialização** (art. 44 — *nº do inciso e alcance atual a confirmar*; mais restritivo que o CFM, que permite preço de consulta).

**Impacto no MedGroth:** duas bifurcações que o motor precisa conhecer: (a) usuário é o dentista pessoa física ou a clínica PJ? O antes/depois que é lícito para o dentista é vedado para a conta da clínica; (b) sugestões de "divulgue o valor da consulta" não podem ir para o perfil odontologia.

## 6. CFBM — Biomedicina

**Base legal:** Código de Ética do Biomédico — Res. CFBM 330/2020 (revogou a 198/2011; contém capítulo explícito de publicidade em redes sociais, com multa de até 5 anuidades e/ou suspensão de até 12 meses). Biomedicina estética: habilitação regulada pela Res. CFBM 197/2011 (e normas posteriores dos CRBMs sobre procedimentos autorizados — lista exata a confirmar).

**O que muda vs CFM:** estrutura parecida (sem promessa de resultado, sem sensacionalismo, identificação profissional), mas o risco específico é o **escopo da biomedicina estética**: só biomédico com habilitação em saúde estética pode executar/anunciar certos procedimentos injetáveis, e a fronteira com atos privativos de medicina é litigiosa (interpretação; há judicialização CFM×CFBM sobre procedimentos invasivos). O motor não deve sugerir nomes de procedimentos específicos ("harmonização", "aplicação de X") — deve falar de "procedimentos da sua habilitação".

## 7. Estética não regulamentada por conselho (esteticistas/cosmetólogos)

**Base legal:** Lei 13.643/2018 regulamenta as profissões de esteticista e cosmetólogo e de técnico em estética — **mas não criou conselho federal**; não existe código deontológico com força de fiscalização própria. O que se aplica:
- **CDC, arts. 30, 36 e 37** (oferta vincula; publicidade identificável; vedada publicidade enganosa/abusiva) — regra clara, e aqui o CDC é o único freio publicitário.
- **CONAR** (autorregulação, Anexos sobre produtos/serviços de saúde e beleza) — adesão voluntária, mas parâmetro de mercado.
- Vigilância sanitária municipal/estadual para o estabelecimento; **Código Penal art. 282 (exercício ilegal da medicina) e LCP art. 47** se anunciar/executar ato privativo de profissão regulamentada.

**O que muda vs CFM:** paradoxo — é o perfil com MENOS regra de publicidade (pode falar de preço, promoção, pacote) e MAIOR risco de escopo (limites do que pode executar: procedimentos não invasivos; a Lei 13.643/2018, art. 4º, delimita as atividades — *conferir texto*). Para o MedGroth, o perigo não é o texto promocional em si, e sim **sugerir protocolo com ato de saúde que o esteticista não pode praticar** — o produto viraria vetor de exercício ilegal de profissão. Ver `checklist-icp-amplo.md`.

---

## O FILTRO ÚNICO — 6 perguntas que todo texto do motor deve passar

Um texto só sai do motor (protocolos, scripts, posts, bios, ofertas) se as respostas forem estas:

1. **Promete, garante ou dá prazo para resultado clínico/estético?** → Se sim, BLOQUEAR. Reescrever como objetivo terapêutico + método + entrega. *(Vedado em todos os conselhos; CDC art. 37 cobre os não conselhados.)*
2. **Usa imagem, depoimento ou relato de resultado de paciente/cliente ("antes e depois", print de balança, caso de sucesso)?** → BLOQUEAR por padrão. Só liberar em perfil onde é lícito (CFO pessoa física com TCLE; CFM educativo com autorização) e nunca para nutrição. Substituir por prova de método (formação, processo, frequência de acompanhamento, conteúdo educativo).
3. **Anuncia preço, desconto, promoção, pacote, brinde, sorteio ou urgência ("últimas vagas")?** → BLOQUEAR por padrão. Preço sóbrio só nos perfis onde é lícito (CFM: consulta; estética não conselhada: livre, respeitado CDC). Nunca para odontologia (preço) e fisioterapia (promoção/pacote com desconto).
4. **Trata o ato de saúde como oferta de varejo (isca, "irresistível", funil agressivo, recompensa por indicação)?** → BLOQUEAR. Reescrever como porta de entrada digna: avaliação estruturada com escopo e valor claros.
5. **O texto identifica o profissional (nome + conselho + nº de registro) e só cita especialidade/título registrado?** → Se não, INJETAR placeholder obrigatório `[Nome — CONSELHO/UF nº 00000]` em todo material publicitário. *(Exigência clara em CFM/CFO; boa prática nos demais; para estética não conselhada, omitir conselho e nunca sugerir título de profissão regulamentada.)*
6. **O procedimento/ato citado está dentro do escopo legal da profissão informada no onboarding?** → Se o motor não sabe a profissão ou o ato é de outra profissão, BLOQUEAR e degradar para linguagem genérica ("procedimentos da sua habilitação"). *(Lei 7.498/1986; Lei 13.643/2018; CP art. 282.)*

**Implementação mínima para a Engenharia:** as perguntas 1-4 são um linter de strings/prompt-guard (listas de padrões proibidos + reescritas); a 5 é um template obrigatório; a 6 depende do campo "profissão" no onboarding. Sem o campo profissão, operar em "modo mais restritivo total".

## Auto-avaliação (onde esta entrega está mais fraca)

1. **Numerações de artigos** de COFFITO 424/2013, COFEN 564/2017 (capítulo de publicidade), CFO-118/2012 art. 44 (incisos de preço) e CFN 856/2026 foram citadas por fonte secundária ou memória — o advogado humano deve conferir cada uma no texto oficial antes de citar em material público do produto.
2. A Res. CFN 856/2026 é muito recente (vigência iniciando agora); pode haver notas técnicas interpretativas do CFN nas próximas semanas que mudem o alcance da exceção técnico-científica.
3. Não cobri psicologia (CFP), farmácia (CFF) e educação física (CONFEF) — se o ICP incluir esses perfis, esta análise precisa de um adendo.
4. A afirmação sobre vedação de preço na odontologia é a regra histórica; há debate recente sobre flexibilização — confirmar o estado atual com o CRO local.
