# Content OS + funil da jornada em São Francisco (09/08/2026)

Origem: artigo longo de Bernardo Precht (@beprecht) no X — "How I'm building a content agent that actually works" — enviado pelo fundador em 09/08/2026, com prints do Notion editorial, do agente Hermes no WhatsApp e dos diagramas "Delegate execution. Keep judgment."

Ideias de origem evoluídas (nada se perde): `2026-08-site-pessoal-trajetoria.md` (trajetória pública verificável), `2026-08-mega-prompt-conversao.md` (funil ClinicNow, linguagem real do comprador, diagnóstico primeiro), `2026-07-ensino-medico.md` (guarda-corpos "revisado por humano" do MedVerse).

Decisões desta ata originaram: a skill `.claude/skills/comite-gerencial/SKILL.md` e a página `content-os.html`.

## 1. Síntese do conceito do Bernardo (o que importa para nós)

- **Delegar execução, manter julgamento.** A pergunta certa não é "como produzir mais", e sim "quanto trabalho operacional posso remover sem terceirizar as decisões que tornam o conteúdo meu".
- Arquitetura em 4 camadas: **Captura** (WhatsApp como interface, nunca como memória) → **Memória** (fonte editorial da verdade: Notion; no nosso caso, este repositório) → **Decisão** (portão humano: tema, ângulo, opinião, aprovação) → **Execução** (pacotes de conteúdo, adaptação de formato, agenda).
- **Entrevista antes do rascunho**: o sistema pergunta a cena concreta, a tensão, a opinião e a evidência. Material fraco gera mais perguntas, não texto plausível.
- **Aprovação exata**: vinculada ao texto, ao asset e ao horário exatos; mudou algo, invalida a aprovação. Kill switch global; erro ambíguo vai para fila de revisão, não para retry cego.
- **Skills versionadas**: cada trabalho repetitivo vira instrução versionada com portões de qualidade — não um prompt solto.
- **Fronteira dura**: nenhum comentário, DM ou engajamento automatizado — as conversas são onde o ponto de vista se forma ("é onde ainda crio alpha").
- Geração fica no fim do processo, não no começo.

## 2. Ata do comitê gerencial nº 1 — Sheldon × Emily × Sóstenes

**Pauta:** definir o sistema de conteúdo intencional da jornada em São Francisco, com funil até a venda do produto (ClinicNow/Emily).

**Emily (execução):** "Capturei o material do Bernardo e cruzei com o que já temos. Três constatações: (1) o nosso `ideias/` já é a 'fonte editorial da verdade' que ele montou no Notion — versionada em Git, melhor ainda; (2) a minha vertente pessoal já é o Hermes dele: o fundador me manda áudio e link pelo WhatsApp e eu organizo; (3) o que NÃO temos é pipeline editorial: nenhuma tabela de posts, insights reutilizáveis, formatos e datas. Hoje a jornada em SF está sendo registrada sem destino comercial."

**Sheldon (julgamento):** "Decisão a propor: montar o Content OS mínimo antes de qualquer automação. Por quê: o gargalo do fundador não é volume, é intenção — conteúdo sem funil é diário de viagem. Como verificar: cada peça publicada precisa ter 1 insight reutilizável e 1 degrau do funil declarado. Risco: virar infraestrutura antes de virar hábito — o próprio Bernardo admite que talvez seja mais do que ele precisa. Por isso: operar manualmente primeiro, automatizar depois (regra que o próprio funil ClinicNow já usa: 'Operate manually before automating'). Próxima ação: definir o funil em 3 degraus e a tabela editorial."

**Emily:** "Proposta de rotina operacional da jornada SF: o fundador captura no WhatsApp (áudio de 1 minuto, foto, link) no momento em que a ideia acontece; eu transcrevo, guardo em `conteudo/` com fonte e data, e apresento no máximo dois ângulos por peça. Agrupamos produção em 2 dias fixos por semana — nada de tocar a operação todo dia."

**Sheldon:** "Fronteira inegociável, herdada do Bernardo e alinhada às regras da casa: DMs e comentários são do Sóstenes. É lá que está a linguagem real do comprador que o funil ClinicNow já minera. Automatizar isso destruiria a pesquisa de produto. E um limite nosso, que o Bernardo não tem: Sóstenes não é médico e o site já declara isso — o conteúdo vende visão de negócio e tecnologia, nunca conduta clínica; publicidade médica (CFM) segue intocada."

**Sóstenes (decisão):** aprova o funil em 3 degraus (§3), a tabela editorial em `conteudo/`, a skill `comite-gerencial` e a regra "manual primeiro". Aprovação de cada peça continua sendo dele, exata (texto + asset + horário).

## 3. O funil aprovado — jornada SF → audiência → produto

| Degrau | Conteúdo | Público-alvo | Chamada |
|---|---|---|---|
| **Topo — audiência** | A jornada em São Francisco: bastidores, aprendizados de IA aplicada à saúde, "o que o Vale faz diferente", erros e custos reais | Médicos e donos de clínica brasileiros curiosos por IA; empreendedores de saúde | Seguir a jornada (perfil) |
| **Meio — autoridade** | Build in public do ClinicNow/Emily: 1 insight reutilizável por peça (formato Bernardo), demonstrações da Emily, números de processo (nunca promessa de resultado) | Médicos com dor de agenda/continuidade | Conversar no WhatsApp / DM |
| **Fundo — venda** | Diagnóstico primeiro (regra do mega-prompt): consultoria de diagnóstico do consultório → clínicas parceiras de design da Emily → ClinicNow | Médicos qualificados na conversa | Agendar diagnóstico |

**Métrica-estrela:** conversas qualificadas com médicos por semana (DM/WhatsApp) — não seguidores.
Métricas de apoio: peças publicadas com insight declarado; taxa conversa→diagnóstico; lista de espera da Emily.

**Tabela editorial** (formato do Notion do Bernardo, adaptado): arquivo `conteudo/PIPELINE.md` com colunas
*Peça · Insight reutilizável · Formato (Viral / Meio de funil / Reflexivo / Dado) · Degrau do funil · Capturada em · Status (capturada → ângulo aprovado → produzida → aprovada exata → publicada) · Resultado (comentários/conversas)*.

## 4. Expansão 10x — o mesmo raciocínio aplicado em paralelo

1. **Content OS pessoal do fundador** (esta ata): WhatsApp → repositório → comitê → publicação. Esforço B · Impacto A · **aprovada**.
2. **Emily-Hermes**: formalizar a vertente pessoal da Emily como o agente de captura do Content OS (transcrição, conexões com referências antigas). Esforço M · Impacto A · registrada.
3. **Content OS como produto do MedGroth/DocGrow**: médicos têm exatamente a mesma dor (imposto operacional do marketing + medo de ferir o CFM). O produto vira "delegue a execução do seu marketing, mantenha o julgamento clínico" com portão de compliance CFM embutido — diferencial que nenhum concorrente do benchmark tem. Esforço A · Impacto A · registrada.
4. **MedVerse — fábrica de questões**: pipeline IA-propõe → professor-aprova já previsto no blueprint (selo "revisado por humano"); adotar a *aprovação exata* do Bernardo (questão + comentário + versão). Esforço M · Impacto A · evolui `2026-07-ensino-medico.md`.
5. **MedVerse — Laboratório de Artigos**: o "a IA nunca faz" do blueprint é o mesmo padrão; acrescentar fila de revisão para erro ambíguo (nunca retry cego) e log de proveniência como "ata de aprovação". Esforço M · Impacto A · evolui `2026-07-ensino-medico.md`.
6. **CareLoop**: agente propõe touchpoints de recorrência, médico aprova o lote exato (mensagem + data); mudou o protocolo, invalida o lote. Esforço M · Impacto M · registrada.
7. **Lia (SosMed)**: "apoio, não diagnóstico" já é a regra da casa = manter julgamento; adotar o *passo de entrevista* (a IA pergunta antes de redigir, não preenche lacuna clínica com texto plausível). Esforço M · Impacto A · registrada.
8. **Funil ClinicNow**: o agente WhatsApp 24/7 do Sprint 3 nasce com human takeover e fila de revisão — é o "Hermes de vendas"; diagnóstico continua sendo o produto de entrada. Esforço M · Impacto A · evolui `2026-08-mega-prompt-conversao.md`.
9. **Skills versionadas como ativo da casa**: todo processo repetido 3x vira skill no repositório com portão de qualidade (`comite-gerencial` é a primeira; candidatas: `producao-conteudo`, `diagnostico-clinicnow`). Esforço B · Impacto M · registrada.
10. **Curso/mentoria futura "Content OS para médicos"**: quando o funil provar conversão, o próprio sistema vira produto de ensino (playbook + skills prontas) — ponte natural com MedVerse modo médico formado. Esforço A · Impacto M · registrada (gatilho: 10 clientes ClinicNow).

## 5. Riscos e limites (Sheldon)

- **Infra antes de hábito**: só automatizar o que já rodou manual 3 semanas.
- **CFM/posicionamento**: conteúdo vende negócio e tecnologia; nunca conduta clínica, nunca promessa de resultado; Sóstenes não é médico e isso permanece explícito.
- **LGPD**: nada de dados reais de pacientes em conteúdo; casos sempre sintéticos (regra já aplicada na página da Emily).
- **Dependência de plataforma**: memória editorial no repositório (Git), nunca na rede social.

Status geral: **aprovada em comitê (ata nº 1) · em execução**.
