# EQUIPE — Scorecard vivo dos agentes
> Mantido pelo setor-evolucao-talentos · atualizado a cada fiscalização · métrica em pares ([B9]): nota média + taxa de devolução
> Missão de referência: ClinicNow "10 primeiros clientes pagantes" (M1), 2026-07-28

| Agente | Notas (M1) | Devoluções | Força comprovada | Fraqueza a treinar | Tendência |
|--------|-----------|------------|------------------|--------------------|-----------|
| **Engenharia** | R1: 5,5 / 7,0 / 6,5 → R2 em avaliação | 1 | Suíte anti-success-theater de qualidade real (caso HTTP 500 ≠ sucesso elogiado por 2 CEOs) | Integrar conhecimento de outros setores — commitou a revisão CFM sem executá-la (L2); escopo de teste estreito (L3) | ↗ em observação |
| **Jurídico** | 9 / 8,5 / 8,5 · APROVADO | 0 | Reescritas acionáveis item a item; separa regra clara de interpretação; achou o mesmo defeito que o CEO-3 de forma independente (L6) | Cobertura de fluxos no código — não varreu o fluxo `cadastro-app` (porta lateral achada pelo CEO-3) | ↗ |
| **Marketing** | R1: 8 / 7,5 / 7,5 → R2 integrada | 1 | Tom honesto anti-guru consistente; critérios de corte numéricos em todo canal; grep de autoverificação na re-entrega | Consistência com a fonte vinculante da oferta (L5); projetou funil sem artefato na junta do caixa (L8) | ↗ |
| **CEO-1 Síntese Tec.** | fiscalização de alta precisão | — | Pegou o defeito invisível ao teste (consentimento descartado no payload) lendo código; pensamento composto (cfm.json p/ era da IA) | Calibrar dureza: nota 5,5 com defeito herdado de spec do orquestrador | → |
| **CEO-2 Founder-Investor** | fiscalização de alta precisão | — | Refez a matemática do funil que ninguém questionou; lista de aceitação do gate acionável | Vigiar viés pró-escassez (preferência declarada e registrada — saudável, mas monitorar) | → |
| **CEO-3 Visão Social** | fiscalização de alta precisão | — | Verificação clique a clique; achou a porta lateral LGPD que o Jurídico perdeu; registra o positivo além do defeito | — | → |
| **Orquestrador** | 1 erro grave registrado | — | Integração e cadência; transparência do próprio erro | **L1 nasceu de erro dele**: smoke test com payload montado à mão; sweep de integração sem executar os achados (co-responsável no L2) | ↗ |

## Lacunas de capacidade detectadas (fila de contratação — aguardando trabalho recorrente que justifique)
1. **Controller financeiro** — P4/P7 do radar: planilha-verdade de MRR/CAC/runway e default-alive contínuo. Justifica-se na abertura do gate (1ª receita). Provável 1ª contratação.
2. **Agente de dados/analytics** — P5b/P9: rastreamento de origem e retenção. Justifica-se quando houver tráfego real (pós-post 1).
3. **DPO/privacidade operacional** — hoje coberto por Jurídico + Engenharia; justifica-se quando houver sync de dados de pacientes na nuvem (Sprint 2).

## Regras do scorecard
- Nota sem veredito citável não entra. Tendência exige ≥2 missões (M1 é baseline).
- Defeito repetido em 2 missões → linha para ([B11]) e o agente recebe diff de treinamento obrigatório no seu contrato.
- CEOs e orquestrador são medidos como todo mundo — a fiscalização também é fiscalizada.
