# Revisão de conformidade — Publicidade Médica (CFM) nas páginas do MedGroth

> Gerado por IA — exige revisão de advogado humano licenciado antes de uso real.
> Varredura de: `medgroth/index.html`, `medgroth/captura.html`, `medgroth/app.html`, `medgroth/investidores.html` (estado de 2026-07-28).

## Moldura jurídica (o que vale aqui)

**Regra clara:**
- **Resolução CFM nº 2.336/2023** (publicidade médica, substituiu a 1.974/2011): veda **garantir ou prometer resultados** e o sensacionalismo; exige que anúncios de médicos contenham **nome, nº CRM e RQE** quando anunciar especialidade; permite divulgar preços de consulta e, sob condições, imagens de "antes e depois" com finalidade educativa, sem promessa de resultado e com autorização do paciente.
- **Código de Ética Médica (Resolução CFM nº 2.217/2018)**: veda o exercício mercantilista da medicina, o aliciamento de pacientes e a divulgação sensacionalista (Capítulo XIII, arts. 111 a 118; princípio IX).
- **CDC (Lei nº 8.078/1990), art. 37**: veda publicidade enganosa — vale para a comunicação B2B do MedGroth com médicos (promessas de faturamento).

**Ponto-chave de arquitetura de risco (interpretação):** o MedGroth não é médico e as resoluções do CFM vinculam médicos, não o SaaS. **Porém**, o produto *sugere textos que o médico vai copiar e colar* (nomes de protocolo, "promessas", scripts). Se a sugestão embutida violar a norma, o MedGroth industrializa a infração do cliente — risco reputacional, de responsabilização civil (CDC/CC) e de matar a tese "venda ética" que é o diferencial declarado do produto. Portanto: todo texto sugerido ao médico deve nascer conforme CFM.

**Confirmação pendente (para o advogado humano):** números exatos de artigos da Res. 2.336/2023 citados por tema (garantia de resultado, antes/depois, identificação CRM/RQE) e o regime atual de **depoimentos de pacientes** — a 2.336/2023 flexibilizou a matéria em relação à 1.974/2011, mas as condições exatas devem ser conferidas no texto oficial e nas notas do CFM antes de qualquer feature de "prova social".

---

## Achados, por gravidade

### CRÍTICO — corrigir antes do primeiro pagante

**1. `app.html` (motor de vendas, gargalo "Precificação")**
> "Empacote em protocolos com **resultado prometido**"

O produto instrui literalmente o médico a prometer resultado — vedação frontal da Res. 2.336/2023 e do CEM (regra clara). É a frase mais perigosa do produto.
**Reescrita:** "Empacote em protocolos com **entregas e acompanhamento claramente definidos** (o que o paciente recebe, com que frequência, por quanto tempo — nunca prometa resultado: é vedado pela publicidade médica)."

**2. `app.html` (PROTOCOLOS — campo `promessa` dos protocolos sugeridos)**
O campo se chama "promessa" e vários textos prometem desfecho clínico, prontos para virar copy do médico:
- "Perda de peso sustentável com acompanhamento próximo e método" (Emagrecimento 90d)
- "**Destravar o metabolismo e gerar o primeiro resultado**" (Reset Metabólico 30 dias) — resultado com prazo;
- "**Resultado estético** com plano de sessões e manutenção" (Estética);
- "**Reduzir ansiedade e recuperar o sono**" (Saúde mental);
- "**Sair da dor** e recuperar função" (Dor/Reabilitação);
- "Mais energia, foco e recuperação" (Performance).

**Não pode assim, pode assado:** o médico pode comunicar **objetivo terapêutico, método e entrega**; não pode garantir desfecho nem prazo de resultado. Reescritas sugeridas (mesma ordem):
- "Programa de emagrecimento com método estruturado e acompanhamento próximo";
- "Avaliação metabólica completa e protocolo inicial de 30 dias com acompanhamento";
- "Plano estético individualizado, com sessões programadas e manutenção";
- "Cuidado estruturado para ansiedade e sono, com plano terapêutico e acompanhamento quinzenal";
- "Avaliação funcional e plano de reabilitação com reavaliações periódicas";
- "Protocolo de performance com avaliação, plano individualizado e acompanhamento mensal".
**Além do texto:** renomear o campo `promessa` → `proposta` (proposta de valor) no código, para o próprio produto não induzir o vocabulário proibido.

### ALTO

**3. `app.html` (vendas, gargalo "Captação")**
> "**Oferta de entrada irresistível** (consulta de avaliação)"

Consulta usada como isca comercial tangencia mercantilização e aliciamento (CEM, Cap. XIII — interpretação: "irresistível" é linguagem de promoção agressiva aplicada a ato médico).
**Reescrita:** "Ofereça uma **consulta de avaliação estruturada, com escopo e valor claros** — a porta de entrada digna do seu método (evite linguagem de promoção agressiva: consulta é ato médico, não isca)."
Mesma lógica, em grau menor, para "Crie uma oferta de entrada acessível (consulta de avaliação ou reset 30 dias)" → "Crie uma porta de entrada de menor compromisso (consulta de avaliação bem estruturada)".

**4. `app.html` (roadmap Semana 2 e estratégia "Autoridade")**
> "Coletar provas sociais (com consentimento)" · "Documente resultados como prova (com consentimento)"

O produto já pede consentimento (bom), mas "prova social" médica tem regras próprias: antes/depois só em contexto educativo, sem promessa de resultado, com autorização do paciente; depoimentos exigem verificação do regime da 2.336/2023 (ver "confirmação pendente" acima). Consentimento LGPD ≠ licença CFM.
**Reescrita:** "Documente resultados clínicos para uso interno e, quando for divulgar, siga as regras da publicidade médica (Res. CFM 2.336/2023): finalidade educativa, autorização por escrito do paciente e nunca com promessa de resultado."

**5. `index.html` (mock do hero)**
> "Receita mensal atual R$ 18.400 · Projeção com plano MedGroth R$ 28.700 ▲"

Publicidade B2B com número de ganho implícito (CDC, art. 37 — enganosidade por implicação; interpretação). O disclaimer do rodapé ajuda, mas está longe do claim.
**Reescrita mínima:** adicionar no próprio mock uma linha pequena "exemplo ilustrativo — não é garantia de resultado" (o `aria-hidden` não elimina o risco: o número é visível).

### MÉDIO

**6. `app.html` (marketing maturidade "Alta")**
> "Lançamentos e **campanhas sazonais**" · "Campanhas sazonais"

Campanha sazonal com desconto/urgência em serviço médico pode configurar mercantilização (interpretação; a 2.336/2023 permite divulgar preços, mas não transforma ato médico em promoção de varejo).
**Reescrita:** "Campanhas informativas sazonais (ex.: conscientização, check-ups de época) — sem descontos-relâmpago nem urgência artificial."

**7. `index.html` (plano Pro)**
> "**Scripts de conversão e recall prontos**"

Não é infração em si, mas cria expectativa de que os scripts são seguros. **Mitigação de processo:** todo script embarcado passa pelo mesmo filtro deste checklist antes de entrar no produto, e cada script exibe o lembrete "adapte à Res. CFM 2.336/2023; inclua seu nome, CRM e RQE em material publicitário" — a exigência de identificação é regra clara e o MedGroth deveria embutir isso nos templates (vira diferencial de "venda ética").

**8. `index.html` (FAQ CFM)**
> "Tudo que o MedGroth recomenda parte de venda ética…"

Afirmação absoluta que o item 1 e 2 hoje desmentem. Após as correções, suavizar: "As recomendações do MedGroth são desenhadas para caber nas normas de publicidade médica; a responsabilidade regulatória final é sempre do profissional." (mantém a honestidade e reduz o risco de claim enganoso sobre o próprio produto).

### BAIXO (monitorar, sem bloqueio)

- `index.html` hero: "transforma consulta avulsa em protocolo e receita recorrente" — B2B, aceitável; manter o disclaimer do rodapé.
- `index.html` FAQ MedEasy: "o argumento de venda **mais honesto que existe**" — superlativo B2B, tolerável; se quiser rigor: "um dos argumentos mais honestos".
- `captura.html`: "Projeção **honesta** de receita" — aceitável com o disclaimer existente; não prometer valor específico.
- `investidores.html`: já contém as ressalvas corretas ("não é oferta pública", "estimativas… podem diferir materialmente") — adequado ao público; nenhuma ação.
- Disclaimers existentes em `index.html` (rodapé) e `app.html` (diagnóstico/plano) são bons — **manter e não remover** em refactors.

---

## Ordem de execução sugerida para a Engenharia
1. Itens 1 e 2 (críticos): trocar strings no `app.html` + renomear campo `promessa`→`proposta`.
2. Itens 3 e 4 (altos): strings do motor de estratégias.
3. Item 5: linha "exemplo ilustrativo" no mock do hero.
4. Itens 6-8: strings menores + ajuste do FAQ.
5. Processo permanente: nenhum texto novo sugerido a médicos entra no produto sem passar por este filtro (checklist de 4 perguntas: promete resultado? usa prazo de desfecho? trata consulta como promoção? induz prova social fora das regras?).
