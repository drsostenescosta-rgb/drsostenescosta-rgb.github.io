/* Persistência no Supabase via REST (PostgREST), com service role.
   Tudo injetado: url, chave e fetch — zero leitura de env, zero segredo aqui.
   Dedup de retries da Meta: insert de mensagem 'in' com
   on_conflict=message_id + Prefer resolution=ignore-duplicates
   (retorna null quando a mensagem já foi processada). */

export function createSupabase({ url, serviceRoleKey, fetchImpl }) {
  if (!url || !serviceRoleKey || !fetchImpl) {
    throw new Error('createSupabase: url, serviceRoleKey e fetchImpl são obrigatórios');
  }
  const base = url.replace(/\/$/, '') + '/rest/v1/';
  const headers = (extra) => ({
    apikey: serviceRoleKey,
    Authorization: `Bearer ${serviceRoleKey}`,
    'Content-Type': 'application/json',
    ...(extra || {}),
  });

  async function request(path, options) {
    const r = await fetchImpl(base + path, options);
    if (!r.ok) {
      const body = await r.text().catch(() => '');
      const err = new Error(`supabase ${options.method || 'GET'} ${path} -> ${r.status}: ${body.slice(0, 300)}`);
      err.status = r.status;
      throw err;
    }
    if (r.status === 204) return null;
    const text = await r.text();
    return text ? JSON.parse(text) : null;
  }

  return {
    async getConversaByPhone(phone) {
      const rows = await request(
        `clinicnow_wa_conversas?phone=eq.${encodeURIComponent(phone)}&limit=1`,
        { method: 'GET', headers: headers() }
      );
      return (rows && rows[0]) || null;
    },

    async createConversa({ phone, nome }) {
      try {
        const rows = await request('clinicnow_wa_conversas', {
          method: 'POST',
          headers: headers({ Prefer: 'return=representation' }),
          body: JSON.stringify({ phone, nome }),
        });
        return rows[0];
      } catch (err) {
        /* corrida entre dois webhooks do mesmo número: unique(phone) → releitura */
        if (err.status === 409) return this.getConversaByPhone(phone);
        throw err;
      }
    },

    async updateConversa(id, patch) {
      await request(`clinicnow_wa_conversas?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: headers({ Prefer: 'return=minimal' }),
        body: JSON.stringify(patch),
      });
    },

    /* Mensagem de entrada. Retorna a linha inserida ou null se message_id
       já existia (retry da Meta — quem chama deve ENCERRAR o processamento). */
    async insertInbound({ messageId, conversaId, content, intent, timestamp }) {
      const rows = await request('clinicnow_wa_mensagens?on_conflict=message_id', {
        method: 'POST',
        headers: headers({ Prefer: 'return=representation,resolution=ignore-duplicates' }),
        body: JSON.stringify({
          message_id: messageId,
          conversa_id: conversaId,
          direction: 'in',
          content,
          intent,
          timestamp,
        }),
      });
      return (rows && rows[0]) || null;
    },

    async insertOutbound({ conversaId, content, model, latencyMs }) {
      const rows = await request('clinicnow_wa_mensagens', {
        method: 'POST',
        headers: headers({ Prefer: 'return=representation' }),
        body: JSON.stringify({
          conversa_id: conversaId,
          direction: 'out',
          content,
          model,
          latency_ms: latencyMs,
        }),
      });
      return (rows && rows[0]) || null;
    },

    /* Últimas N mensagens em ordem cronológica (para contexto do modelo). */
    async getRecentMensagens(conversaId, limit = 20) {
      const rows = await request(
        `clinicnow_wa_mensagens?conversa_id=eq.${encodeURIComponent(conversaId)}` +
          `&order=timestamp.desc&limit=${limit}`,
        { method: 'GET', headers: headers() }
      );
      return (rows || []).reverse();
    },
  };
}
