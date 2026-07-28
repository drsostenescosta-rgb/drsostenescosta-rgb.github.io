# Lições Aprendidas — Registro Vivo do Sistema

Este arquivo é a memória de erros que o sistema não pode repetir. Alimentado exclusivamente pelo Ciclo de Reaprendizado (Fase 5), após passar no Gate de Qualidade. **Toda lição é regra operante**: agentes devem tratá-las como parte do seu contrato. Defeito que contraria uma lição registrada é falha máxima (o ciclo de reaprendizado falhou) e para a linha (andon, [B11]).

Formato: **L# — lição → mecanismo do erro que a originou → regra operante**.

---

**L1 — Smoke test usa o payload do código real, nunca um reconstruído à mão.**
*Origem (Missão MedGroth, Fase 3):* o orquestrador validou o insert no banco com um payload montado manualmente; o código real (`saveLead`) serializava uma lista fixa de campos que descartava o consentimento LGPD — o teste passou e o defeito ficou invisível até o CEO-1 ler o código.
*Regra:* todo teste de integração parte do artefato executável (interceptar a chamada real ou invocar a função real). Testar "o que deveria ser enviado" é teatro de teste.

**L2 — Conhecimento só está integrado quando vira código + teste; arquivo commitado não é integração.**
*Origem:* a revisão CFM do Jurídico foi commitada com reescritas prontas e classificação CRÍTICO, e o produto continuou com as 6 infrações no ar; o commit dizia "integra entregas do Jurídico".
*Regra:* entrega de setor de conhecimento (jurídico, pesquisa, análise) gera obrigatoriamente itens executáveis com dono e teste de regressão; a fiscalização confere a execução, não a presença do arquivo.

**L3 — Todo veto ganha um teste de regressão que cobre TODOS os lugares onde pode renascer.**
*Origem:* o grep de escassez cobria só `index.html` e `captura.html`; a escassez vetada reapareceu em `campanha/emails.md` dias depois de removida do site.
*Regra:* ao vetar um padrão, mapear todas as superfícies onde ele pode voltar (código, docs de campanha, e-mails, prompts) e cobrir no teste — com allowlist explícita para citações legítimas (docs internos que documentam o veto).

**L4 — Agentes paralelos no mesmo repositório: um só executa git; os demais entregam arquivos.**
*Origem:* rodadas com Engenharia + Marketing simultâneos no mesmo working tree; dois processos commitando em paralelo corrompem o índice/interleiam commits.
*Regra:* por rodada, no máximo um agente com mandato de git; os demais editam arquivos disjuntos (ou escrevem no scratchpad) e o orquestrador integra e commita. Conjuntos de arquivos SEMPRE disjuntos por agente.

**L5 — Oferta canônica única, com fonte vinculante nomeada.**
*Origem:* a landing corrigiu a oferta ("enquanto ativa"), e 4 peças de campanha continuaram vendendo a antiga ("20 fundadoras, vitalício") — promessa divergente no momento da compra.
*Regra:* existe UMA fonte vinculante da oferta (termos de uso); toda peça de marketing referencia essa fonte, e mudança na oferta dispara varredura obrigatória em todas as peças (é a aplicação comercial da L3).

**L6 — Vereditos de fiscalização são independentes e cegos; a convergência é o sinal de qualidade.**
*Origem:* os 3 CEOs, sem ver os vereditos uns dos outros, encontraram os mesmos defeitos centrais por lentes diferentes — a convergência independente validou o diagnóstico com confiança que um revisor único não daria.
*Regra:* nunca compartilhar vereditos entre CEOs antes da emissão; defeito achado por 1 entra na lista, defeito achado por 2+ é prioridade automática.

**L7 — Secretarias verificam a atualidade da base antes de cada missão; base desatualizada envenena tudo rio abaixo.**
*Origem:* o BACKLOG dizia "SQL pendente" quando a tabela já existia; dois agentes gastaram ciclo verificando, e um terceiro quase re-executou o SQL.
*Regra:* a Fase 0 inclui verificação ativa: "o que este documento afirma ainda é verdade?" — divergências corrigem o documento na hora (uma fonte só, ver contexto-empresa.md).

**L8 — A cadeia de conversão precisa de artefato em TODAS as juntas — a do caixa primeiro.**
*Origem:* o funil tinha 5 roteiros de topo e 5 e-mails de meio, e zero roteiro para a conversa de 15 minutos onde a venda acontece; instrumentamos tudo menos o caixa.
*Regra:* ao montar um funil, começar o design pela junta onde o dinheiro troca de mãos e trabalhar para trás ([B7] working backwards aplicado a vendas).

**L9 — Naming e qualquer escolha de identidade: gerar e verificar colisão no MESMO ciclo; votar antes da due diligence desperdiça a rodada.**
*Origem (assembleia de naming):* o Conselho votou às cegas em 91 nomes e os 6 mais votados morreram na checagem de colisão (Prax era homônimo de concorrente direto financiado; Healix, de gigante global com marca USPTO). A rodada seguinte, com verificação embutida na geração, produziu finalistas limpos em uma passada.
*Regra:* toda proposta de identidade (nome, domínio, handle, marca) chega à votação já com verificação de colisão anexada; candidato sem evidência de busca não entra na cédula. Verificação formal (INPI/USPTO/registro.br) antes de qualquer registro ou anúncio público.
