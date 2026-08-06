# Os 3 produtos · Especificação (jul/2026)

Diretriz do fundador: "não criamos a roda, fazemos ela melhor — e por que roda se podemos voar?" Cada produto parte de modelo já validado no mundo (benchmark) e melhora a base que já existe no repositório.

## 1. CareLoop — recorrência de pacientes (`careloop/`)

- **Dor:** receita do consultório zera todo mês; paciente abandona o tratamento no meio.
- **O que é:** o médico transforma protocolos em **assinaturas de cuidado** (acompanhamento contínuo com cobrança mensal automática). Painel de MRR, renovações, adimplência; jornada do assinante com lembretes WhatsApp; contratos digitais.
- **Modelo validado:** DocX/Treint (Direct-to-Doctor) + Direct Primary Care (Hint Health, EUA).
- **Compliance:** nunca "plano de saúde" (ANS); contrato de prestação de serviços recorrente; revisão jurídica antes do 1º cliente.
- **Base reaproveitada:** infra de cobrança do Sprint 2 (Stripe/Mercado Pago), protocolos precificados do MedGroth, WhatsApp já integrado.
- **Preços de lançamento:** Início R$ 147 · Prática R$ 297 · Clínica R$ 597 (20 vagas fundadoras com preço travado).

## 2. DocGrow — crescimento + operação (`docgrow/`, evolução internacional do MedGroth)

- **Dor:** depender de indicação; ferramentas espalhadas; paciente sem follow-up não volta.
- **O que é:** MedGroth melhorado — marketing (diagnóstico 3 min, plano 4 semanas, CRM, scripts IA) + **organização** (agenda unificada, follow-up automático via WhatsApp) + **telemedicina centralizada** (sala de vídeo na agenda, conforme Res. CFM 2.314/2022), com painel de metas e relatório mensal.
- **Modelo validado:** Prime/Treint (all-in-one), Doctolib/Docplanner (agenda), players de follow-up dos EUA.
- **Base reaproveitada:** todo o `medgroth/app.html` (diagnóstico, plano, CRM, metas) + agenda/tele planejadas no SosMed. MedGroth BR permanece como marca de transição; assinantes migram sem custo.
- **Preços:** mantém R$ 97 / 297 / 997.

## 3. MedVerse — ensino médico (`medverse/`)

- **Dor:** conteúdo espalhado e desatualizado; estudo sem método/constância; artigo científico que leva meses de burocracia.
- **O que é (2 personas):**
  - **Estudante:** perfil acadêmico com imagens; integração com sistemas de universidades (notas, materiais, planos de ensino, agenda); banco de questões **gamificado estilo Duolingo** (trilhas, XP, streak, ligas, revisão espaçada); estágios e ligas acadêmicas; grupos WhatsApp; **rede social médica de estudo** (resumos, flashcards e casos compartilhados com validação por referência).
  - **Médico formado:** procedimentos, técnicas e protocolos atualizados de bases seguras (PubMed, SciELO, Cochrane); preparação residência/títulos/USMLE; **Laboratório de Artigos** — assistente de escrita científica com integridade acadêmica (IA estrutura e revisa, nunca fabrica dados ou referências).
- **Modelo validado:** AMBOSS, UWorld, Osmosis, Duolingo (mecânica), DocAtlas/Treint, ChagasAI (BR — concorrente a superar em completude).
- **Preços de lançamento:** Estudante R$ 39 · Interno R$ 79 · Residente/Médico R$ 129 (50 vagas fundadoras com 50% para sempre).
- **Riscos a gerir:** direitos autorais de questões (criar banco próprio/licenciado), LGPD de dados acadêmicos, integridade acadêmica explícita.

## Encaixe no ecossistema Zatheon

```
MedVerse (forma e atualiza) → DocGrow (enche e organiza a agenda) → CareLoop (perpetua a receita)
                    SosMed (operação clínica) · MedEasy (paciente)
```

*Status: páginas de venda criadas em jul/2026; avaliação do comitê em `2026-07-comite-aprovacao.md`.*
