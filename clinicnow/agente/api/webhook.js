/* ClinicNow · Agente de Vendas WhatsApp — webhook (Vercel serverless, Node).
   Camada FINA: toda a lógica vive em ../lib (pura e injetável); aqui só
   entram env vars, o SDK real da Anthropic e o fetch global.
   ÚNICO arquivo do agente autorizado a ler process.env — nenhum segredo
   aparece no código, só nomes de variáveis. */

import { verifyWebhookQuery } from '../lib/parse.js';
import { processWebhookBody } from '../lib/agent.js';
import { createSupabase } from '../lib/persist.js';
import { createWhatsAppSender } from '../lib/respond.js';
import { classifyIntent } from '../lib/classify.js';
import { generateReply } from '../lib/generate.js';

const DEFAULT_LINKS = {
  captura: 'https://drsostenescosta-rgb.github.io/clinicnow/captura.html',
  politica: 'https://drsostenescosta-rgb.github.io/clinicnow/privacidade.html',
};

let cachedDeps = null;

async function defaultDeps() {
  if (cachedDeps) return cachedDeps;
  /* Import dinâmico: o SDK só é carregado no primeiro POST em produção;
     os testes herméticos injetam mocks e nunca tocam esta função. */
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-5';
  const intentModel = process.env.ANTHROPIC_INTENT_MODEL || 'claude-haiku-4-5';

  const db = createSupabase({
    url: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE,
    fetchImpl: fetch,
  });
  const sender = createWhatsAppSender({
    token: process.env.META_TOKEN,
    phoneNumberId: process.env.PHONE_NUMBER_ID,
    graphVersion: process.env.GRAPH_API_VERSION || 'v23.0',
    fetchImpl: fetch,
  });

  cachedDeps = {
    db,
    sendText: sender.sendText,
    classify: (text) => classifyIntent(text, { anthropic, model: intentModel }),
    generateReply: (args) => generateReply(args, { anthropic, model }),
    links: {
      captura: process.env.LINK_CAPTURA || DEFAULT_LINKS.captura,
      politica: process.env.LINK_POLITICA || DEFAULT_LINKS.politica,
    },
    now: Date.now,
    log: console,
  };
  return cachedDeps;
}

function queryFrom(req) {
  if (req.query && typeof req.query === 'object') return req.query;
  const idx = (req.url || '').indexOf('?');
  if (idx === -1) return {};
  return Object.fromEntries(new URLSearchParams(req.url.slice(idx + 1)));
}

export function createHandler(getDeps = defaultDeps) {
  return async function handler(req, res) {
    if (req.method === 'GET') {
      /* Verificação do webhook (Meta): hub.mode / hub.verify_token / hub.challenge. */
      const challenge = verifyWebhookQuery(queryFrom(req), process.env.VERIFY_TOKEN);
      if (challenge !== null) {
        res.status(200).send(challenge);
      } else {
        res.status(403).send('Forbidden');
      }
      return;
    }

    if (req.method === 'POST') {
      /* 200 IMEDIATO (exigência Meta < 5s); o processamento continua no mesmo
         invocation — a promise do handler só resolve quando ele termina. */
      res.status(200).send('EVENT_RECEIVED');
      try {
        const deps = await getDeps();
        await processWebhookBody(req.body, deps);
      } catch (err) {
        console.error('[webhook] erro no processamento:', err);
      }
      return;
    }

    res.status(405).send('Method Not Allowed');
  };
}

export default createHandler();
