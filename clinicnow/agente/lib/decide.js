/* Decisão pura: dado o estado da conversa + intent, o que o agente faz.
   Nenhum I/O, nenhum env — o coração testável do comportamento.
   F1: SEM link de agendamento externo (entra só na F3, gated por
   alta_intencao). Alta intenção convida para a conversa de 15 min via
   link de captura existente (injetado pelo código, nunca pelo modelo). */

export function decide({ intent, aiPaused, isFirstContact, messageType = 'text' }) {
  if (aiPaused) {
    /* Takeover: humano assumiu. Mensagem é registrada, IA fica muda. */
    return { reply: false, reason: 'ai_paused', pause: false, includeLgpd: false, invite: false, deterministicReply: null };
  }
  if (messageType !== 'text') {
    return {
      reply: true,
      reason: 'non_text',
      pause: false,
      includeLgpd: isFirstContact === true,
      invite: false,
      deterministicReply: NON_TEXT_REPLY,
    };
  }
  if (intent === 'humano_solicitado') {
    /* Pausa automática + resposta honesta de transição (playbook: a IA avisa
       a transição com honestidade). Notificação ao Founder = F3. */
    return {
      reply: true,
      reason: 'handoff',
      pause: true,
      includeLgpd: isFirstContact === true,
      invite: false,
      deterministicReply: HANDOFF_REPLY,
    };
  }
  return {
    reply: true,
    reason: 'normal',
    pause: false,
    includeLgpd: isFirstContact === true,
    invite: intent === 'alta_intencao',
    deterministicReply: null,
  };
}

export const HANDOFF_REPLY =
  'Perfeito — vou pausar o assistente por aqui e avisar nossa equipe para uma pessoa assumir a conversa. Você recebe o retorno neste mesmo WhatsApp.';

export const NON_TEXT_REPLY =
  'Por enquanto eu só consigo ler mensagens de texto por aqui. Pode me escrever o que você precisa?';

export function lgpdNotice(linkPolitica) {
  return (
    'Oi! Antes de começar, transparência: você está falando com o assistente virtual (IA) do ClinicNow, ' +
    'e esta conversa fica registrada para melhorar o atendimento. ' +
    `Política de privacidade: ${linkPolitica} — e você pode pedir um atendimento humano a qualquer momento.`
  );
}

export function inviteConversa15(linkCaptura) {
  return (
    'Se quiser acelerar, o melhor próximo passo é uma conversa de 15 minutos com o fundador — sem compromisso. ' +
    `É só deixar seus dados aqui que retornamos para agendar: ${linkCaptura}`
  );
}

/* Monta a mensagem final: [aviso LGPD] + corpo + [convite alta intenção].
   Links entram SÓ aqui — determinístico e testável (o modelo é proibido de
   escrever URLs pelo prompt). */
export function composeReply({ core, decision, links }) {
  const parts = [];
  if (decision.includeLgpd) parts.push(lgpdNotice(links.politica));
  if (core) parts.push(core);
  if (decision.invite) parts.push(inviteConversa15(links.captura));
  return parts.join('\n\n').trim();
}
