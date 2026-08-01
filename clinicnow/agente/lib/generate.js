/* Geração da resposta de conversa (modelo principal, injetado — padrão do
   deploy: claude-sonnet-5 via env ANTHROPIC_MODEL no webhook).
   Sem parâmetros de sampling (temperature/top_p são rejeitados pela família
   atual de modelos) e sem config de thinking (adaptive é o default do
   Sonnet 5 e decide sozinho o quanto pensar em mensagens curtas). */

export function buildHistoryMessages(rows, currentText) {
  const mapped = (rows || [])
    .filter((r) => r && r.content)
    .map((r) => ({
      role: r.direction === 'out' ? 'assistant' : 'user',
      content: r.content,
    }));
  /* O primeiro turno precisa ser 'user' — descarta assistants iniciais. */
  while (mapped.length && mapped[0].role === 'assistant') mapped.shift();
  /* Garante que a mensagem atual encerra o array como turno 'user'. */
  if (!mapped.length || mapped[mapped.length - 1].role !== 'user' ||
      mapped[mapped.length - 1].content !== currentText) {
    mapped.push({ role: 'user', content: currentText });
  }
  return mapped;
}

export async function generateReply({ system, history, currentText }, { anthropic, model }) {
  const resp = await anthropic.messages.create({
    model,
    max_tokens: 768,
    system,
    messages: buildHistoryMessages(history, currentText),
  });
  const text = (resp.content || [])
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('\n')
    .trim();
  return { text, model: resp.model || model };
}
