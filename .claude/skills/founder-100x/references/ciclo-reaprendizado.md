# O Ciclo de Reaprendizado

**A ordem é: entregar sempre com um ciclo de reaprendizado.** Nenhuma missão termina na entrega — termina quando o sistema ficou permanentemente melhor por causa dela. Este ciclo é obrigatório e fecha toda missão (Fase 5 do protocolo).

## As 5 etapas

### 1. Sensor — o que aconteceu de verdade
Coletar sinais objetivos da missão que terminou:
- Entregas devolvidas pelo Conselho (quantas vezes, por quais defeitos).
- Divergência entre estimativa e realidade (tempo, custo, resultado).
- Feedback externo: cliente, usuário, mercado, Founder humano.
- Falhas silenciosas: o que ninguém pediu para corrigir mas está errado.

### 2. Diagnóstico — o mecanismo, não o sintoma
Para cada sinal negativo, perguntar "por quê" até chegar ao mecanismo causal:
- Foi falta de contexto? → falha de nutrição (responsabilidade do Conselho/secretarias).
- Foi instrução ambígua? → falha desta skill ou do Contrato de Missão.
- Foi limite de capacidade? → registrar como fronteira atual; reavaliar quando os modelos melhorarem.
- Foi processo errado? → falha estrutural; candidata a mudança permanente.

### 3. Correção Permanente — mudar o sistema, não só o caso
Ordem de preferência (Lei do Composto):
1. **Atualizar esta skill**: editar os arquivos em `.claude/skills/founder-100x/` — nova regra, exemplo de defeito recorrente, ajuste de protocolo. Commitar no branch de trabalho com mensagem `reaprendizado: <lição>` (ou abrir PR se a mudança for grande).
2. **Atualizar a Base de Contexto** (`CONTEXTO-EMPRESA.md`): novos fatos, decisões tomadas, portas fechadas e o porquê.
3. **Atualizar specs e contratos de entrega** dos setores que falharam.
4. Só por último: correção pontual sem mudança sistêmica (registrar por que não gerou aprendizado permanente).

### 4. Gate de Qualidade — a mudança melhora ou só muda?
Antes de aplicar uma mudança na skill ou no processo:
- A regra nova resolveria a falha que a motivou? (teste contra o caso real)
- Ela quebra algo que funcionava? (procurar contra-exemplo)
- Ela é geral o suficiente para valer em missões futuras, ou é caso único?
Mudança que não passa no gate vira nota no registro, não regra.

### 5. Registro e Entrega — legibilidade total
O relatório final de toda missão inclui a seção **"O que o sistema aprendeu"**:
- Lições (positivas e negativas), com o mecanismo causal de cada uma.
- Mudanças aplicadas em si mesmo (diffs na skill, na base de contexto, nas specs).
- Fronteiras encontradas (o que ainda não é possível e quando reavaliar).
- Próxima missão sugerida pelo aprendizado.

## Métrica do ciclo
O sistema está saudável quando **o mesmo defeito nunca causa duas devoluções em missões diferentes**. Defeito repetido = ciclo de reaprendizado falhou = prioridade máxima do setor Correção de Sistema.
