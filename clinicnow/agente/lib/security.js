/* Validação da assinatura X-Hub-Signature-256 da Meta (HMAC-SHA256 do corpo
   cru com o App Secret). Helper puro e testado; o wiring no webhook exige
   acesso ao corpo cru (raw body) e está documentado no README como item de
   endurecimento do deploy (F1: VERIFY_TOKEN no GET; assinatura opcional). */

import crypto from 'node:crypto';

export function verifyMetaSignature(rawBody, signatureHeader, appSecret) {
  if (!rawBody || !signatureHeader || !appSecret) return false;
  const expected =
    'sha256=' + crypto.createHmac('sha256', appSecret).update(rawBody).digest('hex');
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signatureHeader));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
