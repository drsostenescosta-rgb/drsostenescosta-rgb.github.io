# DocGrow — Inovações além do básico (agente de inovação · 28/07/2026)

Origem: rodada de agentes pedida pelo fundador na evolução MedGroth → DocGrow (`2026-07-registro-prompt-docgrow.md`). Regra do banco: ideias novas entram aqui; ao evoluir alguma, citar este arquivo.

## Implementadas já na fundação (28/07)

1. **Practice Health Score (0–100)** — nota viva do consultório calculada dos dados reais (perfil + pacientes + consultas 30d + receita paga 30d + follow-ups 30d). View `docgrow_health_score` no ar. Vira a régua do diagnóstico contínuo: o plano de 4 semanas passa a atacar a componente mais fraca do score.
2. **Cofre de Receita Recuperada** — contador de R$ que o produto devolveu ao médico (no-shows evitados + recalls convertidos), view `docgrow_cofre_recuperado`. Decisão do comitê: é a **tela inicial** do app no Sprint 2. Prova de valor medida, nunca promessa (regra 2).

## Fila priorizada (não iniciar antes dos gatilhos do BACKLOG)

3. **Modo "semana difícil"** — quando a agenda da semana cai abaixo da média, o app propõe automaticamente uma campanha de recall para pacientes sumidos há 90+ dias (usa `docgrow_followups`, zero custo de mídia).
4. **Migração assistida MedGroth→DocGrow** — botão único que copia leads/diagnósticos do usuário para o perfil novo, preservando preço de fundador (dados já compatíveis por design: `lead_id` em `docgrow_diagnosticos`).
5. **Benchmark anônimo por nicho** — "consultórios do seu nicho convertem X% dos leads" agregado de `docgrow_eventos`, sem expor ninguém (LGPD by design, mínimo de 10 perfis por nicho).
6. **Follow-up com ROI atribuído** — todo follow-up convertido grava `resultado_valor`; relatórios sempre mostram "este recurso te gerou R$ X" em vez de métricas de vaidade.
7. **Radar de reviews** — pós-consulta realizada, pedido de review Google no momento de maior satisfação (ROI comprovado por Doctolib/Tebra; aprovado para Sprint 3).
8. **Precificação por câmbio congelado** — assinante internacional trava o câmbio do dia da assinatura por 12 meses; remove o medo da variação cambial sem tocar no preço em US$.
9. **Diagnóstico como lead magnet internacional** — versão EN/ES do diagnóstico de 3 minutos como porta de entrada do DocGrow (mesmo motor, `docgrow_diagnosticos.respostas` já é JSONB agnóstico de idioma).
10. **Playbook de nicho autoalimentado** — os planos de 4 semanas que mais geraram receita (via Cofre) viram templates sugeridos para novos médicos do mesmo nicho.

## Regra de ouro

Nenhuma inovação entra no produto sem responder: *qual métrica do comitê ela move* (diagnósticos/mês, lead→conversa ≥40%, clientes pagantes, churn zero)? Se não move, fica aqui na fila.
