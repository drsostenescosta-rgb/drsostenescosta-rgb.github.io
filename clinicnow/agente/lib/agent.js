/* Orquestração de uma entrega de webhook: parse → classifica → persiste →
   decide → gera → envia → mede latência. Todas as dependências injetadas
   (db, classify, generateReply, sendText, links, now) — o webhook só faz o
   wiring. É o artefato executável que os testes exercitam com payloads
   REAIS da Meta (L1). */

import { extractInboundMessages } from './parse.js';
import { buildSystemPrompt, PROMPT_VERSION } from './prompt.js';
import { decide, composeReply } from './decide.js';
import { FALLBACK_INTENT } from './intents.js';

export async function processWebhookBody(body, deps) {
  const inbound = extractInboundMessages(body);
  const results = [];
  for (const msg of inbound) {
    try {
      results.push(await processInbound(msg, deps));
    } catch (err) {
      (deps.log || console).error(`[agente] falha ao processar ${msg.messageId}:`, err);
      results.push({ phone: msg.phone, messageId: msg.messageId, error: String(err) });
    }
  }
  return results;
}

export async function processInbound(msg, deps) {
  const { db, classify, generateReply, sendText, links } = deps;
  const now = deps.now || Date.now;
  const t0 = now();

  /* 1. Conversa (cria na primeira mensagem do número). */
  let conversa = await db.getConversaByPhone(msg.phone);
  const isFirstContact = !conversa;
  if (!conversa) conversa = await db.createConversa({ phone: msg.phone, nome: msg.nome });

  /* 2. Intent — gravada em 100% das mensagens de entrada (DoD 2).
     Não-texto não passa pelo classificador: registra fora_escopo. */
  const isText = msg.type === 'text';
  const content = isText ? msg.text : `[${msg.type}]`;
  /* Defesa em profundidade: o classificador já tem fallback interno, mas se
     a dependência injetada lançar, a intent ainda é registrada (DoD 2). */
  let intent = 'fora_escopo';
  if (isText) {
    try {
      intent = await classify(msg.text);
    } catch (_err) {
      intent = FALLBACK_INTENT;
    }
  }

  /* 3. Persiste a entrada com dedup por message_id (retry da Meta). */
  const inserted = await db.insertInbound({
    messageId: msg.messageId,
    conversaId: conversa.id,
    content,
    intent,
    timestamp: msg.timestamp,
  });
  if (!inserted) {
    return { phone: msg.phone, messageId: msg.messageId, skipped: 'duplicate' };
  }
  await db.updateConversa(conversa.id, { intent_atual: intent });

  /* 4. Decide. Takeover (ai_paused) cala a IA DE VERDADE (DoD 4). */
  const decision = decide({
    intent,
    aiPaused: conversa.ai_paused === true,
    isFirstContact,
    messageType: msg.type,
  });
  if (!decision.reply) {
    return { phone: msg.phone, messageId: msg.messageId, intent, skipped: decision.reason };
  }

  /* 5. Corpo da resposta: determinístico (handoff/não-texto) ou modelo. */
  let core;
  let usedModel = null;
  if (decision.deterministicReply) {
    core = decision.deterministicReply;
  } else {
    const history = await db.getRecentMensagens(conversa.id, 20);
    const generated = await generateReply({
      system: buildSystemPrompt(),
      history,
      currentText: content,
    });
    core = generated.text;
    usedModel = generated.model;
  }

  if (decision.pause) {
    await db.updateConversa(conversa.id, { ai_paused: true });
  }

  /* 6. Compõe (LGPD na primeira resposta; convite só em alta_intencao),
     envia e grava a saída com a latência ponta a ponta medida (DoD 1). */
  const replyText = composeReply({ core, decision, links });
  await sendText(msg.phone, replyText);
  const latencyMs = Math.max(0, Math.round(now() - t0));
  await db.insertOutbound({
    conversaId: conversa.id,
    content: replyText,
    model: usedModel,
    latencyMs,
  });

  return {
    phone: msg.phone,
    messageId: msg.messageId,
    intent,
    replied: true,
    paused: decision.pause,
    latencyMs,
    promptVersion: PROMPT_VERSION,
  };
}
