# Regras do repositório — ecossistema Zatheon (Sóstenes Costa Paiva)

## Banco de ideias (regra permanente)

- **Antes de trabalhar em qualquer projeto deste repositório, consulte a pasta `ideias/`.** Ela é o banco de ideias do fundador: toda ideia nova deve ser registrada lá, e ideias existentes devem ser melhoradas — nunca perdidas nem duplicadas.
- Ao concluir qualquer estudo, benchmark ou plano, adicione as ideias resultantes em `ideias/` (um arquivo por tema, datado no título interno).
- Ao propor algo novo, verifique se já existe ideia relacionada em `ideias/` e evolua a partir dela, citando o arquivo de origem.

## Estrutura do ecossistema

- **Zatheon** — holding/guarda-chuva de todos os produtos.
- `medgroth/` — MedGroth (BR): crescimento de consultório. Variação internacional: DocGrow (`docgrow/`).
- `sosmed/` — SosMed: console do profissional (agenda, prontuário, Lia IA, marketplace, telemedicina).
- `medeasy.html` — MedEasy: camada do paciente (índice de saúde).
- `careloop/` — CareLoop: recorrência de pacientes (assinatura de cuidado — nunca chamar de "plano de saúde", termo regulado pela ANS).
- `medverse/` — MedVerse: ensino médico (estudantes + médicos formados, banco de questões gamificado, rede social de estudo, máquina de artigos com integridade acadêmica).
- Documentos estratégicos ficam junto do produto (ex.: `medgroth/BACKLOG.md`, `medgroth/BENCHMARK-TREINT.md`).

## Regras de produto que não mudam

1. Nenhum lead se perde — fallback local sempre ativo; banco é espelho, não gargalo.
2. Venda ética — respeitar publicidade médica (CFM); prova de valor = resultado medido, nunca promessa.
3. Chave de API nunca no frontend — IA e pagamentos só via funções serverless.
4. Preço de fundador é sagrado.
5. IA clínica sempre com guarda-corpos: "apoio, não diagnóstico", log auditável.
6. Dados no Brasil (Supabase São Paulo), LGPD como argumento de venda.
