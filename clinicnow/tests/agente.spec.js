/* Agente de Vendas WhatsApp — suíte hermética da F1.
   Spec vinculante: clinicnow/specs/SPEC-AGENTE-WHATSAPP.md (DoD 1–8).
   L1: os testes de fluxo exercitam o ARTEFATO EXECUTÁVEL (processWebhookBody,
   createHandler) com payloads no formato OFICIAL do webhook da Meta
   (WhatsApp Cloud API) — nada de payload reconstruído fora do formato real.
   Supabase/Anthropic/Graph são mocks INJETADOS (zero rede, zero segredo). */
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');
const { test, expect } = require('@playwright/test');

const AGENTE = path.resolve(__dirname, '..', 'agente');
const CLINICNOW = path.resolve(__dirname, '..');
const lib = (name) => import(pathToFileURL(path.join(AGENTE, 'lib', name)).href);
const api = (name) => import(pathToFileURL(path.join(AGENTE, 'api', name)).href);

/* ---------------------------------------------------------------- fixtures */
/* Payload OFICIAL de mensagem de texto (WhatsApp Cloud API, field=messages). */
function metaTextPayload({ text = 'Olá', id = 'wamid.HBgNNTU4NDk5OTk5MDAwMBUCABIYFjNFQjBEMUExQjIA', from = '5584999990000', name = 'Dra. Teste' } = {}) {
  return {
    object: 'whatsapp_business_account',
    entry: [{
      id: '102290129340398',
      changes: [{
        value: {
          messaging_product: 'whatsapp',
          metadata: { display_phone_number: '15550783881', phone_number_id: '106540352242922' },
          contacts: [{ profile: { name }, wa_id: from }],
          messages: [{ from, id, timestamp: '1753900000', type: 'text', text: { body: text } }],
        },
        field: 'messages',
      }],
    }],
  };
}

/* Payload OFICIAL de status (entrega/leitura) — deve ser ignorado. */
const META_STATUS_PAYLOAD = {
  object: 'whatsapp_business_account',
  entry: [{
    id: '102290129340398',
    changes: [{
      value: {
        messaging_product: 'whatsapp',
        metadata: { display_phone_number: '15550783881', phone_number_id: '106540352242922' },
        statuses: [{ id: 'wamid.STATUS1', status: 'delivered', timestamp: '1753900001', recipient_id: '5584999990000' }],
      },
      field: 'messages',
    }],
  }],
};

function metaImagePayload({ id = 'wamid.IMG1', from = '5584999990000' } = {}) {
  const p = metaTextPayload({ id, from });
  p.entry[0].changes[0].value.messages = [{
    from, id, timestamp: '1753900000', type: 'image',
    image: { mime_type: 'image/jpeg', sha256: 'abc', id: '3243342' },
  }];
  return p;
}

/* ------------------------------------------------------------------- mocks */
function makeDb(state) {
  state.conversas = state.conversas || [];
  state.mensagens = state.mensagens || [];
  state.updates = [];
  let seq = 0;
  return {
    async getConversaByPhone(phone) {
      return state.conversas.find((c) => c.phone === phone) || null;
    },
    async createConversa({ phone, nome }) {
      const c = { id: 'conv-' + (++seq), phone, nome, ai_paused: false, intent_atual: null };
      state.conversas.push(c);
      return c;
    },
    async updateConversa(id, patch) {
      state.updates.push({ id, patch });
      Object.assign(state.conversas.find((c) => c.id === id), patch);
    },
    async insertInbound({ messageId, conversaId, content, intent, timestamp }) {
      if (messageId && state.mensagens.some((m) => m.message_id === messageId)) return null; // dedup
      const rec = { id: 'msg-' + (++seq), message_id: messageId, conversa_id: conversaId, direction: 'in', content, intent, timestamp };
      state.mensagens.push(rec);
      return rec;
    },
    async insertOutbound({ conversaId, content, model, latencyMs }) {
      const rec = { id: 'msg-' + (++seq), message_id: null, conversa_id: conversaId, direction: 'out', content, model, latency_ms: latencyMs };
      state.mensagens.push(rec);
      return rec;
    },
    async getRecentMensagens(conversaId, limit) {
      return state.mensagens.filter((m) => m.conversa_id === conversaId).slice(-limit);
    },
  };
}

function makeDeps(state, { intent = 'saudacao', modelText = 'Entendi! Me conta: hoje sua agenda depende de indicação?', classify } = {}) {
  const sent = [];
  const generateCalls = [];
  let clock = 1000;
  const deps = {
    db: makeDb(state),
    classify: classify || (async () => intent),
    generateReply: async ({ system, history, currentText }) => {
      generateCalls.push({ system, history, currentText });
      return { text: modelText, model: 'claude-sonnet-5' };
    },
    sendText: async (to, body) => { sent.push({ to, body }); return { messages: [{ id: 'wamid.OUT' }] }; },
    links: { captura: 'https://example.test/clinicnow/captura.html', politica: 'https://example.test/clinicnow/privacidade.html' },
    now: () => (clock += 37),
    log: { error() {} },
  };
  return { deps, sent, generateCalls };
}

/* =================================================================== PARSE */

test('GET de verificação Meta: token correto ecoa o challenge; errado/incompleto nega', async () => {
  const { verifyWebhookQuery } = await lib('parse.js');
  const okQuery = { 'hub.mode': 'subscribe', 'hub.verify_token': 'tok-forte-123', 'hub.challenge': '1158201444' };
  expect(verifyWebhookQuery(okQuery, 'tok-forte-123')).toBe('1158201444');
  expect(verifyWebhookQuery({ ...okQuery, 'hub.verify_token': 'errado' }, 'tok-forte-123')).toBe(null);
  expect(verifyWebhookQuery({ ...okQuery, 'hub.mode': 'unsubscribe' }, 'tok-forte-123')).toBe(null);
  expect(verifyWebhookQuery({}, 'tok-forte-123')).toBe(null);
  expect(verifyWebhookQuery(okQuery, undefined)).toBe(null);
});

test('parse do payload oficial da Meta: extrai phone, nome, id, texto e phone_number_id', async () => {
  const { extractInboundMessages } = await lib('parse.js');
  const msgs = extractInboundMessages(metaTextPayload({ text: 'Olá' }));
  expect(msgs).toHaveLength(1);
  expect(msgs[0]).toMatchObject({
    phone: '5584999990000',
    nome: 'Dra. Teste',
    type: 'text',
    text: 'Olá',
    phoneNumberId: '106540352242922',
  });
  expect(msgs[0].messageId).toMatch(/^wamid\./);
  expect(new Date(msgs[0].timestamp).getTime()).toBe(1753900000 * 1000);
});

test('payload de status (delivered/read) e payloads malformados não geram mensagens', async () => {
  const { extractInboundMessages } = await lib('parse.js');
  expect(extractInboundMessages(META_STATUS_PAYLOAD)).toHaveLength(0);
  expect(extractInboundMessages(null)).toHaveLength(0);
  expect(extractInboundMessages({ object: 'page', entry: [] })).toHaveLength(0);
  expect(extractInboundMessages({ object: 'whatsapp_business_account' })).toHaveLength(0);
});

/* ================================================== FLUXO (DoD 1, 2, 5, 7) */

test('DoD 1+2+7: "Olá" → conversa criada, entrada gravada COM intent, resposta enviada, saída gravada com latency_ms e model; primeira resposta traz aviso LGPD + link da política + transparência de IA', async () => {
  const { processWebhookBody } = await lib('agent.js');
  const state = {};
  const { deps, sent } = makeDeps(state, { intent: 'saudacao' });

  const results = await processWebhookBody(metaTextPayload({ text: 'Olá' }), deps);

  expect(results).toHaveLength(1);
  expect(results[0]).toMatchObject({ intent: 'saudacao', replied: true, paused: false });
  // conversa criada
  expect(state.conversas).toHaveLength(1);
  expect(state.conversas[0]).toMatchObject({ phone: '5584999990000', nome: 'Dra. Teste', ai_paused: false, intent_atual: 'saudacao' });
  // entrada gravada com intent (DoD 2)
  const inbound = state.mensagens.find((m) => m.direction === 'in');
  expect(inbound).toMatchObject({ content: 'Olá', intent: 'saudacao' });
  expect(inbound.message_id).toMatch(/^wamid\./);
  // resposta entregue via Graph (mock)
  expect(sent).toHaveLength(1);
  expect(sent[0].to).toBe('5584999990000');
  // saída gravada com latência medida e modelo (DoD 1)
  const outbound = state.mensagens.find((m) => m.direction === 'out');
  expect(outbound.model).toBe('claude-sonnet-5');
  expect(typeof outbound.latency_ms).toBe('number');
  expect(outbound.latency_ms).toBeGreaterThan(0);
  expect(outbound.content).toBe(sent[0].body);
  // DoD 7: consentimento na PRIMEIRA resposta, com link da política
  expect(sent[0].body).toContain('assistente virtual');
  expect(sent[0].body).toContain('registrada');
  expect(sent[0].body).toContain(deps.links.politica);
});

test('segunda mensagem da mesma conversa NÃO repete o aviso LGPD', async () => {
  const { processWebhookBody } = await lib('agent.js');
  const state = {};
  const { deps, sent } = makeDeps(state, { intent: 'duvida_produto' });
  await processWebhookBody(metaTextPayload({ text: 'Olá', id: 'wamid.A1' }), deps);
  await processWebhookBody(metaTextPayload({ text: 'Como funciona?', id: 'wamid.A2' }), deps);
  expect(sent).toHaveLength(2);
  expect(sent[0].body).toContain(deps.links.politica);
  expect(sent[1].body).not.toContain(deps.links.politica);
  expect(sent[1].body).not.toContain('Política de privacidade');
});

/* ======================================== REGRA DO LINK / CALENDLY (DoD 3) */

test('DoD 3: baixa intenção (duvida_preco) NUNCA recebe link de agendamento nem Calendly', async () => {
  const { processWebhookBody } = await lib('agent.js');
  const state = {};
  const { deps, sent } = makeDeps(state, { intent: 'duvida_preco' });
  await processWebhookBody(metaTextPayload({ text: 'Quanto custa?', id: 'wamid.P1' }), deps);
  expect(sent).toHaveLength(1);
  expect(sent[0].body.toLowerCase()).not.toContain('calendly');
  expect(sent[0].body).not.toContain(deps.links.captura);
});

test('alta_intencao: convite determinístico para a conversa de 15 minutos com o link de captura (F1, sem Calendly)', async () => {
  const { processWebhookBody } = await lib('agent.js');
  const state = {};
  const { deps, sent } = makeDeps(state, { intent: 'alta_intencao' });
  await processWebhookBody(metaTextPayload({ text: 'Quero começar, como faço?', id: 'wamid.H1' }), deps);
  expect(sent[0].body).toContain('15 minutos');
  expect(sent[0].body).toContain(deps.links.captura);
  expect(sent[0].body.toLowerCase()).not.toContain('calendly');
});

/* ============================================= TAKEOVER / PAUSA (DoD 4) */

test('DoD 4: humano_solicitado → resposta honesta de transição, pausa automática, modelo de conversa NÃO é chamado', async () => {
  const { processWebhookBody } = await lib('agent.js');
  const { HANDOFF_REPLY } = await lib('decide.js');
  const state = {};
  const { deps, sent, generateCalls } = makeDeps(state, { intent: 'humano_solicitado' });
  const results = await processWebhookBody(metaTextPayload({ text: 'Quero falar com uma pessoa', id: 'wamid.T1' }), deps);
  expect(results[0].paused).toBe(true);
  expect(sent[0].body).toContain(HANDOFF_REPLY);
  expect(generateCalls).toHaveLength(0); // resposta determinística, sem modelo
  expect(state.conversas[0].ai_paused).toBe(true);
  expect(state.updates.some((u) => u.patch.ai_paused === true)).toBe(true);
});

test('DoD 4: com ai_paused=true a mensagem CHEGA ao banco (com intent) mas NADA é respondido; despausar retoma', async () => {
  const { processWebhookBody } = await lib('agent.js');
  const state = { conversas: [{ id: 'conv-x', phone: '5584999990000', nome: 'Dra. Teste', ai_paused: true, intent_atual: null }] };
  const { deps, sent, generateCalls } = makeDeps(state, { intent: 'duvida_produto' });

  const r1 = await processWebhookBody(metaTextPayload({ text: 'Ainda tem alguém aí?', id: 'wamid.S1' }), deps);
  expect(r1[0].skipped).toBe('ai_paused');
  expect(state.mensagens.filter((m) => m.direction === 'in')).toHaveLength(1);
  expect(state.mensagens[0].intent).toBe('duvida_produto'); // registrada mesmo pausada
  expect(sent).toHaveLength(0);
  expect(generateCalls).toHaveLength(0);

  // despausa (o que o dashboard fará na F2) → volta a responder
  state.conversas[0].ai_paused = false;
  const r2 = await processWebhookBody(metaTextPayload({ text: 'Voltei', id: 'wamid.S2' }), deps);
  expect(r2[0].replied).toBe(true);
  expect(sent).toHaveLength(1);
});

/* ========================================= ROBUSTEZ (dedup, mídia, status) */

test('retry da Meta (mesmo wamid) não gera resposta duplicada', async () => {
  const { processWebhookBody } = await lib('agent.js');
  const state = {};
  const { deps, sent } = makeDeps(state);
  const payload = metaTextPayload({ text: 'Olá', id: 'wamid.DUP1' });
  const r1 = await processWebhookBody(payload, deps);
  const r2 = await processWebhookBody(payload, deps);
  expect(r1[0].replied).toBe(true);
  expect(r2[0].skipped).toBe('duplicate');
  expect(sent).toHaveLength(1);
  expect(state.mensagens.filter((m) => m.direction === 'in')).toHaveLength(1);
});

test('mensagem não-texto (imagem): registrada com intent e respondida com fallback determinístico, sem chamar o modelo', async () => {
  const { processWebhookBody } = await lib('agent.js');
  const { NON_TEXT_REPLY } = await lib('decide.js');
  const state = {};
  const { deps, sent, generateCalls } = makeDeps(state);
  await processWebhookBody(metaImagePayload(), deps);
  const inbound = state.mensagens.find((m) => m.direction === 'in');
  expect(inbound.content).toBe('[image]');
  expect(inbound.intent).toBe('fora_escopo');
  expect(sent[0].body).toContain(NON_TEXT_REPLY);
  expect(generateCalls).toHaveLength(0);
});

test('payload de status não dispara classificação, gravação nem resposta', async () => {
  const { processWebhookBody } = await lib('agent.js');
  const state = {};
  const { deps, sent } = makeDeps(state);
  const results = await processWebhookBody(META_STATUS_PAYLOAD, deps);
  expect(results).toHaveLength(0);
  expect(state.mensagens || []).toHaveLength(0);
  expect(sent).toHaveLength(0);
});

test('DoD 2 (defesa em profundidade): classificador injetado que LANÇA ainda resulta em intent gravada (fallback)', async () => {
  const { processWebhookBody } = await lib('agent.js');
  const { FALLBACK_INTENT } = await lib('intents.js');
  const state = {};
  const { deps, sent } = makeDeps(state, { classify: async () => { throw new Error('anthropic caiu'); } });
  const results = await processWebhookBody(metaTextPayload({ text: 'Oi', id: 'wamid.F1' }), deps);
  expect(results[0].replied).toBe(true);
  expect(state.mensagens.find((m) => m.direction === 'in').intent).toBe(FALLBACK_INTENT);
  expect(sent).toHaveLength(1);
});

/* ============================================== CLASSIFICADOR (unidade) */

test('classifyIntent: structured output com enum das 8 intents da spec; resposta válida vira intent; lixo/erro caem no fallback', async () => {
  const { classifyIntent, buildClassifyRequest } = await lib('classify.js');
  const { INTENTS, FALLBACK_INTENT } = await lib('intents.js');

  expect(INTENTS).toEqual([
    'saudacao', 'duvida_produto', 'duvida_preco', 'objecao',
    'alta_intencao', 'suporte_cliente', 'fora_escopo', 'humano_solicitado',
  ]);

  const req = buildClassifyRequest('quanto custa?', 'claude-haiku-4-5');
  expect(req.model).toBe('claude-haiku-4-5');
  expect(req.output_config.format.type).toBe('json_schema');
  expect(req.output_config.format.schema.properties.intent.enum).toEqual(INTENTS);
  expect(req).not.toHaveProperty('temperature'); // família atual rejeita sampling params

  const ok = { messages: { create: async () => ({ content: [{ type: 'text', text: '{"intent":"duvida_preco"}' }] }) } };
  expect(await classifyIntent('quanto custa?', { anthropic: ok, model: 'claude-haiku-4-5' })).toBe('duvida_preco');

  const lixo = { messages: { create: async () => ({ content: [{ type: 'text', text: 'não sei' }] }) } };
  expect(await classifyIntent('oi', { anthropic: lixo, model: 'claude-haiku-4-5' })).toBe(FALLBACK_INTENT);

  const foraDaLista = { messages: { create: async () => ({ content: [{ type: 'text', text: '{"intent":"spam"}' }] }) } };
  expect(await classifyIntent('oi', { anthropic: foraDaLista, model: 'claude-haiku-4-5' })).toBe(FALLBACK_INTENT);

  const quebrado = { messages: { create: async () => { throw new Error('500'); } } };
  expect(await classifyIntent('oi', { anthropic: quebrado, model: 'claude-haiku-4-5' })).toBe(FALLBACK_INTENT);
});

test('generateReply: histórico vira turnos user/assistant válidos e a request não carrega sampling params nem thinking manual', async () => {
  const { generateReply, buildHistoryMessages } = await lib('generate.js');

  const rows = [
    { direction: 'out', content: 'resposta antiga' }, // assistant no início é descartado
    { direction: 'in', content: 'Olá' },
    { direction: 'out', content: 'Oi! Como posso ajudar?' },
    { direction: 'in', content: 'Quanto custa?' },
  ];
  const msgs = buildHistoryMessages(rows, 'Quanto custa?');
  expect(msgs[0].role).toBe('user');
  expect(msgs[msgs.length - 1]).toEqual({ role: 'user', content: 'Quanto custa?' });

  let captured = null;
  const anthropic = { messages: { create: async (req) => { captured = req; return { model: 'claude-sonnet-5', content: [{ type: 'text', text: 'ok' }] }; } } };
  const out = await generateReply({ system: 'SYS', history: rows, currentText: 'Quanto custa?' }, { anthropic, model: 'claude-sonnet-5' });
  expect(out).toEqual({ text: 'ok', model: 'claude-sonnet-5' });
  expect(captured.system).toBe('SYS');
  expect(captured.max_tokens).toBeGreaterThan(0);
  for (const banido of ['temperature', 'top_p', 'top_k', 'thinking']) {
    expect(captured).not.toHaveProperty(banido);
  }
});

/* ============================== CONTRATOS Supabase / Graph (fetch mockado) */

test('contrato Supabase: service role nos headers, dedup por on_conflict=message_id, insert 200 vs duplicado', async () => {
  const { createSupabase } = await lib('persist.js');
  const calls = [];
  const respostas = [JSON.stringify([{ id: 'row-1' }]), '[]'];
  const fakeFetch = async (url, opts) => {
    calls.push({ url, opts });
    return { ok: true, status: 200, text: async () => respostas[calls.length - 1] };
  };
  const db = createSupabase({ url: 'https://projeto.supabase.co', serviceRoleKey: 'CHAVE_INJETADA', fetchImpl: fakeFetch });

  const row = await db.insertInbound({ messageId: 'wamid.X', conversaId: 'c1', content: 'Olá', intent: 'saudacao', timestamp: '2026-08-01T00:00:00Z' });
  expect(row).toEqual({ id: 'row-1' });
  expect(calls[0].url).toBe('https://projeto.supabase.co/rest/v1/clinicnow_wa_mensagens?on_conflict=message_id');
  expect(calls[0].opts.headers.apikey).toBe('CHAVE_INJETADA');
  expect(calls[0].opts.headers.Authorization).toBe('Bearer CHAVE_INJETADA');
  expect(calls[0].opts.headers.Prefer).toContain('resolution=ignore-duplicates');
  const body = JSON.parse(calls[0].opts.body);
  expect(body).toMatchObject({ message_id: 'wamid.X', conversa_id: 'c1', direction: 'in', content: 'Olá', intent: 'saudacao' });

  // segunda entrega do mesmo wamid → PostgREST devolve [] → null (dedup)
  const dup = await db.insertInbound({ messageId: 'wamid.X', conversaId: 'c1', content: 'Olá', intent: 'saudacao', timestamp: '2026-08-01T00:00:00Z' });
  expect(dup).toBe(null);
});

test('contrato Graph API: endpoint com phone_number_id, Bearer token injetado, body oficial de texto', async () => {
  const { createWhatsAppSender } = await lib('respond.js');
  const calls = [];
  const fakeFetch = async (url, opts) => {
    calls.push({ url, opts });
    return { ok: true, status: 200, json: async () => ({ messages: [{ id: 'wamid.OUT1' }] }), text: async () => '' };
  };
  const sender = createWhatsAppSender({ token: 'TOKEN_INJETADO', phoneNumberId: '106540352242922', graphVersion: 'v23.0', fetchImpl: fakeFetch });
  await sender.sendText('5584999990000', 'Oi!');
  expect(calls[0].url).toBe('https://graph.facebook.com/v23.0/106540352242922/messages');
  expect(calls[0].opts.headers.Authorization).toBe('Bearer TOKEN_INJETADO');
  const body = JSON.parse(calls[0].opts.body);
  expect(body).toMatchObject({ messaging_product: 'whatsapp', to: '5584999990000', type: 'text', text: { body: 'Oi!' } });
});

test('assinatura Meta (helper de endurecimento): HMAC-SHA256 válido passa, inválido/ausente falha', async () => {
  const crypto = require('crypto');
  const { verifyMetaSignature } = await lib('security.js');
  const raw = JSON.stringify(metaTextPayload());
  const sig = 'sha256=' + crypto.createHmac('sha256', 'app-secret').update(raw).digest('hex');
  expect(verifyMetaSignature(raw, sig, 'app-secret')).toBe(true);
  expect(verifyMetaSignature(raw, sig, 'outro-secret')).toBe(false);
  expect(verifyMetaSignature(raw, 'sha256=deadbeef', 'app-secret')).toBe(false);
  expect(verifyMetaSignature(raw, undefined, 'app-secret')).toBe(false);
});

/* ============================================ HANDLER (webhook fino, DoD 1) */

function fakeRes() {
  return {
    statusCode: null, body: null, ended: false,
    status(c) { this.statusCode = c; return this; },
    send(b) { this.body = b; this.ended = true; return this; },
  };
}

test('handler GET: verificação da Meta com VERIFY_TOKEN do ambiente (200+challenge vs 403)', async () => {
  const { createHandler } = await api('webhook.js');
  const prev = process.env.VERIFY_TOKEN;
  process.env.VERIFY_TOKEN = 'tok-teste';
  try {
    const handler = createHandler(async () => { throw new Error('GET não usa deps'); });
    const ok = fakeRes();
    await handler({ method: 'GET', query: { 'hub.mode': 'subscribe', 'hub.verify_token': 'tok-teste', 'hub.challenge': '42' } }, ok);
    expect(ok.statusCode).toBe(200);
    expect(ok.body).toBe('42');

    const nega = fakeRes();
    await handler({ method: 'GET', url: '/api/webhook?hub.mode=subscribe&hub.verify_token=errado&hub.challenge=42' }, nega);
    expect(nega.statusCode).toBe(403);
  } finally {
    if (prev === undefined) delete process.env.VERIFY_TOKEN; else process.env.VERIFY_TOKEN = prev;
  }
});

test('handler POST: responde 200 ANTES de processar (exigência Meta <5s) e processa com as deps injetadas; método inválido → 405', async () => {
  const { createHandler } = await api('webhook.js');
  const state = {};
  const res = fakeRes();
  let respondidoAntesDoProcessamento = null;
  const { deps, sent } = makeDeps(state, {
    classify: async () => { respondidoAntesDoProcessamento = res.ended; return 'saudacao'; },
  });
  const handler = createHandler(async () => deps);
  await handler({ method: 'POST', body: metaTextPayload({ text: 'Olá' }) }, res);
  expect(res.statusCode).toBe(200);
  expect(res.body).toBe('EVENT_RECEIVED');
  expect(respondidoAntesDoProcessamento).toBe(true); // 200 saiu antes de classificar
  expect(sent).toHaveLength(1);

  const r405 = fakeRes();
  await handler({ method: 'PUT' }, r405);
  expect(r405.statusCode).toBe(405);
});

test('handler POST: erro interno de processamento NÃO derruba o webhook (200 mantido, erro engolido com log)', async () => {
  const { createHandler } = await api('webhook.js');
  const handler = createHandler(async () => { throw new Error('deps quebradas'); });
  const res = fakeRes();
  await handler({ method: 'POST', body: metaTextPayload() }, res);
  expect(res.statusCode).toBe(200);
});

/* ================================= GREPS ESTÁTICOS (DoD 6, DoD 8, higiene) */

function walkFiles(dir, exts) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full, exts));
    else if (exts.some((e) => entry.name.endsWith(e))) out.push(full);
  }
  return out;
}

test('DoD 8: zero segredo no repositório do agente (padrões de chave banidos por grep)', async () => {
  const arquivos = walkFiles(AGENTE, ['.js', '.json', '.md', '.sql']);
  expect(arquivos.length).toBeGreaterThan(5);
  const padroes = [
    [/sk-ant-[A-Za-z0-9_-]{8,}/, 'chave Anthropic'],
    [/\bEAA[A-Za-z0-9]{20,}/, 'token Meta'],
    [/eyJ[A-Za-z0-9_-]{10,}\.eyJ/, 'JWT (service role antiga)'],
    [/sb_secret_[A-Za-z0-9]/, 'chave secreta Supabase'],
    [/whsec_[A-Za-z0-9]/, 'signing secret'],
    [/AKIA[0-9A-Z]{16}/, 'chave AWS'],
  ];
  for (const f of arquivos) {
    const txt = fs.readFileSync(f, 'utf8');
    for (const [re, nome] of padroes) {
      expect(re.test(txt), `${nome} encontrado em ${path.relative(CLINICNOW, f)}`).toBe(false);
    }
  }
});

test('higiene de configuração: lib/ é pura (zero process.env); webhook.js é o único consumidor de env e referencia todas as vars do contrato', async () => {
  const libFiles = walkFiles(path.join(AGENTE, 'lib'), ['.js']);
  for (const f of libFiles) {
    const txt = fs.readFileSync(f, 'utf8');
    expect(txt.includes('process.env'), `process.env vazou para ${path.basename(f)} — lib deve receber tudo injetado`).toBe(false);
  }
  const webhook = fs.readFileSync(path.join(AGENTE, 'api', 'webhook.js'), 'utf8');
  for (const envVar of ['VERIFY_TOKEN', 'META_TOKEN', 'PHONE_NUMBER_ID', 'ANTHROPIC_API_KEY', 'ANTHROPIC_MODEL', 'ANTHROPIC_INTENT_MODEL', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE']) {
    expect(webhook).toContain(`process.env.${envVar}`);
  }
  // modelos default do contrato (spec + ordem de implementação)
  expect(webhook).toContain("'claude-sonnet-5'");
  expect(webhook).toContain("'claude-haiku-4-5'");
});

test('DoD 6: zero promessa de desfecho no prompt (executável e versionado) + guarda-corpos presentes', async () => {
  const { buildSystemPrompt, PROMPT_VERSION } = await lib('prompt.js');
  const promptTexto = buildSystemPrompt();
  const promptDoc = fs.readFileSync(path.join(CLINICNOW, 'specs', 'prompt-agente-v1.md'), 'utf8');
  expect(PROMPT_VERSION).toBe('v1');

  const banidos = ['resultado prometido', 'garantimos', 'resultado garantido', 'sucesso garantido',
    'vagas limitadas', '20 primeiras', 'últimas vagas', 'dobrar o faturamento'];
  for (const alvo of [['prompt.js (texto gerado)', promptTexto], ['specs/prompt-agente-v1.md', promptDoc]]) {
    for (const frase of banidos) {
      expect(alvo[1].toLowerCase().includes(frase), `"${frase}" encontrado em ${alvo[0]}`).toBe(false);
    }
  }
  // guarda-corpos e identidade obrigatórios no prompt executável
  for (const obrigatoria of ['assistente virtual', 'cadeia de conversão sem dono', 'agenda previsível',
    'NUNCA prometa números', 'NUNCA escreva links', 'atende pacientes']) {
    expect(promptTexto).toContain(obrigatoria);
  }
  // DoD 5 (transparência): instrução explícita de se identificar como IA
  expect(promptTexto).toContain('afirme com clareza que é um assistente virtual de IA');
});

test('sincronia prompt.js ↔ prompt-agente-v1.md ↔ oferta canônica (L5): frases-chave e preços iguais aos do index', async () => {
  const { buildSystemPrompt } = await lib('prompt.js');
  const promptTexto = buildSystemPrompt();
  const promptDoc = fs.readFileSync(path.join(CLINICNOW, 'specs', 'prompt-agente-v1.md'), 'utf8');
  const index = fs.readFileSync(path.join(CLINICNOW, 'index.html'), 'utf8');

  for (const chave of ['cadeia de conversão sem dono', 'assistente virtual', 'agenda previsível', 'R$ 297']) {
    expect(promptTexto, `"${chave}" ausente do prompt executável`).toContain(chave);
    expect(promptDoc, `"${chave}" ausente do doc versionado`).toContain(chave);
  }
  for (const preco of ['R$ 297', 'R$ 697', 'R$ 997']) {
    expect(promptTexto).toContain(preco);
    expect(index, `preço ${preco} do prompt não existe na página oficial (L5!)`).toContain(preco);
  }
  expect(promptTexto).toContain('cobrança anual');
});

test('DoD 3 (estático): nenhum arquivo EXECUTÁVEL do agente contém Calendly na F1 (o link entra só na F3, gated por alta_intencao)', async () => {
  // Allowlist L3: docs (.md) podem CITAR o Calendly para documentar a regra/fase;
  // código, config e SQL não podem — link de agendamento só nasce na F3.
  for (const f of walkFiles(AGENTE, ['.js', '.json', '.sql'])) {
    const txt = fs.readFileSync(f, 'utf8').toLowerCase();
    expect(txt.includes('calendly'), `calendly encontrado em ${path.relative(CLINICNOW, f)}`).toBe(false);
  }
});

test('migração 001: tabelas da spec, RLS habilitada nas duas e NENHUMA policy pública', async () => {
  const sql = fs.readFileSync(path.join(AGENTE, 'migrations', '001-wa-tables.sql'), 'utf8').toLowerCase();
  expect(sql).toContain('create table if not exists public.clinicnow_wa_conversas');
  expect(sql).toContain('create table if not exists public.clinicnow_wa_mensagens');
  for (const col of ['phone', 'ai_paused', 'intent_atual', 'criado_em', 'message_id', 'conversa_id', 'direction', 'latency_ms']) {
    expect(sql).toContain(col);
  }
  expect((sql.match(/enable row level security/g) || []).length).toBe(2);
  expect(sql.includes('create policy'), 'policy pública encontrada — F1 é service-role-only').toBe(false);
  expect(sql).toContain('revoke all');
});

test('DoD 8: README documenta todas as env vars do contrato e o passo a passo de deploy', async () => {
  const readme = fs.readFileSync(path.join(AGENTE, 'README.md'), 'utf8');
  for (const envVar of ['META_TOKEN', 'PHONE_NUMBER_ID', 'VERIFY_TOKEN', 'ANTHROPIC_API_KEY',
    'ANTHROPIC_MODEL', 'ANTHROPIC_INTENT_MODEL', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE']) {
    expect(readme, `env var ${envVar} não documentada no README`).toContain(envVar);
  }
  expect(readme).toContain('001-wa-tables.sql');
  expect(readme.toLowerCase()).toContain('vercel');
});

test('smoke de sintaxe: todos os módulos do agente importam sem erro (ESM válido)', async () => {
  for (const f of walkFiles(path.join(AGENTE, 'lib'), ['.js'])) {
    await import(pathToFileURL(f).href);
  }
  const mod = await api('webhook.js');
  expect(typeof mod.default).toBe('function');
  expect(typeof mod.createHandler).toBe('function');
});
