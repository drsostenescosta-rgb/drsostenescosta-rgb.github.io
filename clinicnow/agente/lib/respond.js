/* Envio de mensagens via Graph API (WhatsApp Cloud API).
   Token e phone_number_id injetados — zero leitura de env aqui. */

export function createWhatsAppSender({ token, phoneNumberId, graphVersion = 'v23.0', fetchImpl }) {
  if (!token || !phoneNumberId || !fetchImpl) {
    throw new Error('createWhatsAppSender: token, phoneNumberId e fetchImpl são obrigatórios');
  }
  const endpoint = `https://graph.facebook.com/${graphVersion}/${phoneNumberId}/messages`;

  return {
    async sendText(to, body) {
      const r = await fetchImpl(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to,
          type: 'text',
          text: { preview_url: false, body },
        }),
      });
      if (!r.ok) {
        const detail = await r.text().catch(() => '');
        throw new Error(`graph api ${r.status}: ${detail.slice(0, 300)}`);
      }
      return r.json();
    },
  };
}
