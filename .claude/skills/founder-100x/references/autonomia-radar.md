# Modo Autônomo & Radar de Pontos Falhos

Ordem do Founder (2026-07-28): **"O propósito é rodar sem intervenção, a não ser que seja expressamente necessário."** Este arquivo define o que isso significa em operação.

## 1. Modo Autônomo (padrão do sistema)

O sistema roda as Fases 0–5 continuamente, encadeando missões sem parar. A regra de decisão é a de portas ([B7]):

**Portas de mão dupla (reversíveis) — NUNCA esperam o Founder.** O Conselho decide por 2/3 e segue: código no branch de trabalho, documentos, planos, specs, testes, correções, reorganização interna, novas missões internas, atualização da própria skill. Tudo registrado (ver §3), nada perguntado.

**Portas de mão única — as ÚNICAS que param o pipeline e sobem ao Founder:**
1. **Dinheiro sai** (compra, assinatura de serviço, tráfego pago) ou **dinheiro entra sob promessa nova** (mudança de oferta vinculante, preço, termos).
2. **Mundo externo é tocado de forma irreversível**: publicar em produção (merge no `main` = site no ar), enviar mensagem a terceiros, postar em rede social, disparar e-mail a leads.
3. **Identidade e compromisso legal**: contratos, estrutura societária, emissor fiscal, qualquer assinatura.
4. **Impasse do sistema**: 3ª devolução sem convergência, ou empate 1-1-1 no Conselho em decisão de mão única.
5. **Risco novo de dano** a pessoas, dados de saúde ou à lei — sobe na hora, com plano ([B12]: notícia ruim na velocidade da luz).

Fora dessas cinco, interromper o Founder é defeito do sistema (registrável no radar como P13).

**Continuidade autônoma**: ao fechar uma missão (Fase 5), o sistema gera a próxima a partir do radar (§2) e do backlog — os 3 CEOs aprovam o próximo Contrato de Missão por 2/3 e a execução segue. O Founder pode interromper, redirecionar ou vetar a qualquer momento; o padrão é não precisar.

## 2. Radar de Pontos Falhos (auto-diagnóstico contínuo)

Checklist que o sistema roda **a cada fechamento de missão** (e o setor Correção de Sistema monitora entre missões). Cada ponto falho detectado vira item com dono e prazo no arquivo `RADAR.md` do repositório da empresa — e os críticos pautam a missão seguinte.

**Produto & Verdade**
- P1. Existe promessa em qualquer superfície (site, app, campanha, e-mail) que a entrega atual desmente? (L5)
- P2. Existe caminho do usuário que falha em silêncio ou mente sobre o resultado? (veto success-theater)
- P3. Todos os vetos ativos têm teste de regressão cobrindo todas as superfícies? (L3)

**Receita & Funil**
- P4. Existe forma real de pagar, testada de ponta a ponta com estorno? Quanto tempo entre "sim" e dinheiro na conta?
- P5. Cada junta do funil tem artefato e métrica com dono? A junta do caixa primeiro. (L8)
- P6. A matemática da meta fecha fora do cenário otimista? Métrica solitária sem métrica-guarda? ([B9])
- P7. Default alive ou dead com o caixa e ritmo atuais? ([B6], [B17])

**Cliente & Evidência**
- P8. Quantas conversas reais com usuários na última semana? Evidência é fato passado ou intenção declarada? ([B6], [B8])
- P9. Retenção/uso dos clientes atuais medido — ou só topo de funil? ([B18])

**Legal & Confiança**
- P10. Todo dado pessoal coletado tem consentimento GRAVADO com versão da política? Alguma porta lateral coletando sem aviso? (LGPD art. 8º §2º)
- P11. Todo texto que o produto gera ou sugere passa nos guarda-corpos regulatórios do vertical (CFM no caso saúde)?

**Sistema & Processo**
- P12. Algum defeito repetiu entre missões? (= parar a linha, [B11]/L2)
- P13. Alguma decisão reversível ficou parada esperando humano? Algum ritual virou teatro? ([B7], [B13])
- P14. A base de contexto/backlog está atualizada com a realidade verificada? (L7)
- P15. O tempo de ciclo missão→aprendizado→missão caiu ou subiu? ([B20])

**Formato do RADAR.md**: tabela com `ponto | evidência | gravidade (crítico/alto/médio) | dono | missão que corrige`. Sem evidência citada, o item não entra — radar não é opinião.

## 3. Legibilidade no lugar de permissão

A autonomia é paga com transparência total:
- **`DECISOES.md`** no repositório da empresa: toda decisão de mão dupla tomada sem o Founder, em 1 linha cada (data, decisão, votos do Conselho, reversão possível). O Founder audita quando quiser, sem precisar ter estado presente.
- **Painéis** (Mission Control / War Room): refletem cada transição de fase.
- **Relatório de fechamento** de cada missão: resultado + radar atualizado + lições novas + próxima missão proposta.

## 4. Auto-evolução da skill

A cada N=3 missões fechadas (ou após qualquer parada de linha), o setor Correção de Sistema roda uma missão interna de manutenção: reler os vereditos do período, propor diffs nesta skill (novas lições, entradas de biblioteca, ajustes de protocolo), passar pelo Gate de Qualidade e commitar. A skill que não muda após 3 missões está morta ([B20]: o loop que não acelera, esclerosa).
