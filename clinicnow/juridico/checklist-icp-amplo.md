# Checklist — riscos novos do ICP ampliado (profissionais da saúde em geral + donos de clínica)

> **Nota:** produto renomeado para ClinicNow em 2026-07-28. As menções a "MedGroth" abaixo são históricas.

> Minuta/análise gerada por IA — exige revisão de advogado humano licenciado antes de uso real.

## A. Riscos novos, ranqueados (probabilidade × impacto)

### 1. Produto sugerindo protocolo fora da habilitação do usuário — ALTO×ALTO (o risco nº 1 da rodada)
Com ICP só de médicos, qualquer protocolo clínico cabia no escopo. Agora não: os protocolos embarcados ("Emagrecimento 90d", "Saúde mental", "Reset Metabólico") contêm atos privativos de medicina/nutrição se oferecidos a esteticista ou enfermeiro. Se o MedGroth sugere a um esteticista "monte seu protocolo de emagrecimento", o produto induz exercício ilegal de profissão (CP art. 282; LCP art. 47 — regra clara) e o profissional anuncia algo que não pode executar.
**Mitigação:** campo obrigatório "profissão + registro" no onboarding; biblioteca de protocolos com tag de escopo por profissão; protocolo fora de escopo nem aparece (não basta disclaimer — a sugestão em si é o dano). "Não pode assim, pode assado": para cada perfil, versão do protocolo restrita aos atos da profissão (ex.: esteticista → "programa de cuidados estéticos não invasivos"; enfermeiro → "programa de acompanhamento e procedimentos autorizados pelo COFEN").

### 2. Responsabilidade do MedGroth como ferramenta — MÉDIA×ALTO
Tese defensiva: o MedGroth é software de gestão/comunicação; a responsabilidade regulatória é do profissional (relação análoga à do Marco Civil, e o profissional é quem publica). **Limite da tese (interpretação):** ela se sustenta enquanto o produto for neutro. Se o texto vem PRONTO do motor e embute infração, há concurso para o dano — responsabilidade civil por fato próprio (CC arts. 186 e 927) e, perante o profissional-consumidor, defeito do serviço (CDC art. 14). A revisão CFM já mostrou que o produto chegou a sugerir "resultado prometido".
**Mitigação:** o filtro único de 6 perguntas (`publicidade-multiconselho.md`) como gate de build para TODO texto embarcado; cláusula nos termos deixando claro o papel de ferramenta + dever do usuário de adequação ao seu conselho; registro (log) de que o texto final é sempre editável e publicado pelo usuário.

### 3. Marca "MedGroth" para público não médico — MÉDIA×MÉDIO
"Med" sinaliza medicina. Vender a esteticistas/nutricionistas sob marca "Med" cria dois riscos: (i) comunicação que induza o público a parecer serviço médico (CDC art. 37, §1º; e conselhos punem o profissional que se apresenta acima da habilitação); (ii) atrito de posicionamento apontado pelos conselhos. Não é bloqueio jurídico para o nome da empresa em si.
**Mitigação:** tagline explícita ("plataforma de gestão para profissionais da saúde"); nunca gerar copy em que o profissional não médico apareça associado a termos médicos ("consultório médico", "tratamento médico"); avaliar submarca no futuro (decisão de negócio, não jurídica).

### 4. Claims de faturamento para público mais vulnerável — MÉDIA×MÉDIO
O ICP ampliado tem renda média menor e menos assessoria; promessas de receita ("projeção R$ 28,7 mil") pesam mais no teste de enganosidade (CDC art. 37 — a vulnerabilidade do destinatário entra na análise; interpretação consolidada). 
**Mitigação:** manter/reforçar "exemplo ilustrativo — não é garantia de ganho" colado em todo número; nunca usar caso único como típico (padrão FTC/CONAR de earnings claims).

### 5. LGPD — dados de pacientes entrando na plataforma — BAIXA×ALTO (hoje), sobe com o ICP
Clínicas e profissionais tendem a colar dados de pacientes (nome, condição) nos campos livres do app. Dado de saúde é sensível (LGPD art. 5º, II e art. 11 — regra clara); o MedGroth viraria operador de dados sensíveis sem contrato nem base legal.
**Mitigação:** instrução visível "não insira dados de pacientes" nos campos livres; se um dia a feature exigir dados de pacientes, criar DPA (contrato operador × controlador) e RIPD antes — não depois.

## B. Frases de guarda-corpo (devem existir no produto, literalmente)

1. **Rodapé/termos (papel da ferramenta):** "O MedGroth é uma plataforma de gestão e comunicação. Não presta serviços de saúde, não prescreve, não recomenda condutas clínicas e não substitui o julgamento do profissional habilitado."
2. **Ao lado de todo texto gerado:** "Sugestão de texto editável. Antes de publicar, verifique as regras de publicidade do seu conselho profissional e inclua seu nome e nº de registro. A responsabilidade pelo conteúdo publicado é sua."
3. **Na biblioteca de protocolos:** "Use apenas protocolos compatíveis com a sua profissão e habilitações registradas. Oferecer ato de saúde fora da sua habilitação é infração legal e ética."
4. **Em projeções/simuladores de receita:** "Exemplo ilustrativo com base nos dados informados — não é promessa nem garantia de resultado financeiro."
5. **Em campos de texto livre:** "Não insira dados pessoais de pacientes ou clientes (nome, contato, condição de saúde) nesta plataforma."

## C. Auto-avaliação
- O mapeamento de escopo de atos por profissão (item A.1) está em nível de princípio; a tabela ato-a-ato (o que cada profissão pode executar/anunciar) não foi construída — é o próximo entregável necessário antes de a Engenharia taguear a biblioteca de protocolos.
- A tese de neutralidade da ferramenta (A.2) não tem precedente específico para SaaS que gera copy para profissionais de saúde; o dimensionamento do risco é juízo profissional, não jurisprudência.
- Não avaliei o cenário de clínica PJ com profissionais de múltiplos conselhos sob a mesma conta (quem responde pelo post da clínica?) — relevante para o plano "dono de clínica" e pendente.
