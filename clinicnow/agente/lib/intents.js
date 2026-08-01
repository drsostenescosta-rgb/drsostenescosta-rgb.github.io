/* Intents v1 do agente (fonte: specs/SPEC-AGENTE-WHATSAPP.md).
   Regra de segurança: NENHUM arquivo em lib/ lê variáveis de ambiente —
   toda configuração chega injetada pelo webhook (api/webhook.js). */

export const INTENTS = [
  'saudacao',
  'duvida_produto',
  'duvida_preco',
  'objecao',
  'alta_intencao',
  'suporte_cliente',
  'fora_escopo',
  'humano_solicitado',
];

/* Fallback quando a classificação falha (erro de rede, JSON inválido, label
   fora da lista). Escolha deliberada: 'duvida_produto' mantém o fluxo normal
   de resposta — falha de classificador NUNCA pode pausar a conversa nem
   disparar comportamento especial (alta_intencao/humano_solicitado). */
export const FALLBACK_INTENT = 'duvida_produto';
