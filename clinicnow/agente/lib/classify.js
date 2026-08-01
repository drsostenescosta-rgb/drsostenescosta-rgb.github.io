/* Classificação de intent — chamada barata e separada da conversa.
   Modelo injetado (padrão do deploy: claude-haiku-4-5) com structured output
   (json_schema + enum) para garantir label válido; ainda assim valida e cai
   no FALLBACK_INTENT em qualquer falha (rede, JSON, label fora da lista). */

import { INTENTS, FALLBACK_INTENT } from './intents.js';

const CLASSIFIER_SYSTEM = `Você classifica UMA mensagem de WhatsApp enviada por um lead ao ClinicNow (sistema + mentoria para donos de clínica de saúde no Brasil). Responda apenas com o JSON pedido.

Definições:
- saudacao: oi/olá/bom dia sem pedido concreto.
- duvida_produto: pergunta sobre o que é, como funciona, recursos.
- duvida_preco: pergunta sobre preço, planos, condições de pagamento.
- objecao: hesitação, comparação com concorrente/agência, "não sei se funciona pra mim", falta de tempo/dinheiro.
- alta_intencao: quer avançar, contratar, agendar, "como começo", "quero fechar".
- suporte_cliente: já é cliente e precisa de ajuda com o produto.
- fora_escopo: assunto sem relação com o ClinicNow (inclui paciente buscando consulta).
- humano_solicitado: pede explicitamente falar com humano/atendente/pessoa.`;

export function buildClassifyRequest(text, model) {
  return {
    model,
    max_tokens: 64,
    system: CLASSIFIER_SYSTEM,
    messages: [{ role: 'user', content: String(text || '').slice(0, 2000) }],
    output_config: {
      format: {
        type: 'json_schema',
        schema: {
          type: 'object',
          properties: { intent: { type: 'string', enum: INTENTS } },
          required: ['intent'],
          additionalProperties: false,
        },
      },
    },
  };
}

/* anthropic: cliente injetado (SDK oficial ou mock nos testes). */
export async function classifyIntent(text, { anthropic, model }) {
  try {
    const resp = await anthropic.messages.create(buildClassifyRequest(text, model));
    const block = (resp.content || []).find((b) => b.type === 'text');
    const parsed = JSON.parse(block.text);
    if (INTENTS.includes(parsed.intent)) return parsed.intent;
  } catch (_err) {
    /* qualquer falha cai no fallback — classificador nunca derruba o fluxo */
  }
  return FALLBACK_INTENT;
}
