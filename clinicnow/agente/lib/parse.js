/* Parsing puro do webhook da Meta (WhatsApp Cloud API).
   Formato oficial: entry[].changes[].value.{metadata,contacts[],messages[]}.
   Sem env, sem I/O — 100% testável com payloads reais (L1). */

/* GET de verificação do webhook (Meta):
   hub.mode=subscribe & hub.verify_token=<token> & hub.challenge=<eco>.
   Retorna a string do challenge quando válido; null caso contrário. */
export function verifyWebhookQuery(query, verifyToken) {
  if (!query || !verifyToken) return null;
  if (
    query['hub.mode'] === 'subscribe' &&
    query['hub.verify_token'] === verifyToken &&
    typeof query['hub.challenge'] === 'string'
  ) {
    return query['hub.challenge'];
  }
  return null;
}

/* Extrai as mensagens de ENTRADA de um POST da Meta.
   Ignora com segurança: statuses (entrega/leitura), fields != 'messages',
   payloads malformados. Nunca lança. */
export function extractInboundMessages(body) {
  const out = [];
  if (!body || body.object !== 'whatsapp_business_account' || !Array.isArray(body.entry)) {
    return out;
  }
  for (const entry of body.entry) {
    for (const change of entry.changes || []) {
      if (change.field !== 'messages') continue;
      const value = change.value || {};
      const contacts = Array.isArray(value.contacts) ? value.contacts : [];
      for (const msg of value.messages || []) {
        if (!msg || !msg.from || !msg.id) continue;
        const contact = contacts.find((c) => c && c.wa_id === msg.from) || contacts[0];
        out.push({
          phone: msg.from,
          nome: (contact && contact.profile && contact.profile.name) || null,
          messageId: msg.id,
          timestamp: msg.timestamp
            ? new Date(Number(msg.timestamp) * 1000).toISOString()
            : new Date().toISOString(),
          type: msg.type || 'unknown',
          text: msg.type === 'text' ? ((msg.text && msg.text.body) || '') : null,
          phoneNumberId: (value.metadata && value.metadata.phone_number_id) || null,
        });
      }
    }
  }
  return out;
}
