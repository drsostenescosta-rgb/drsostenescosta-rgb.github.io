/* ClinicNow · Payment Links do Stripe (fonte única dos links de checkout)
   ─────────────────────────────────────────────────────────────────────────
   Como funciona:
   - O Founder cria os 3 Payment Links na conta Stripe dele seguindo o guia
     em STRIPE-SETUP.md e cola cada URL abaixo (entre as aspas).
   - Os botões dos planos em index.html leem este objeto. Se o link do plano
     estiver preenchido, o botão vira checkout direto no Stripe.
   - Se o link estiver VAZIO (''), o botão mantém o fluxo atual de captura
     (captura.html?plano=...) — fallback honesto, nunca botão quebrado.
   Regras:
   - Cole apenas URLs https://buy.stripe.com/... geradas na SUA conta.
   - Valores esperados (precisam bater com os termos, seção 2.4):
       start      → R$ 3.564/ano  (exibido como R$ 297/mês, cobrança anual)
       pro        → R$ 8.364/ano  (exibido como R$ 697/mês, cobrança anual)
       aceleracao → R$ 11.964/ano (exibido como R$ 997/mês, cobrança anual)
   - Antes de abrir o gate: teste obrigatório do CEO-2 — 1 transação real
     + estorno (ver STRIPE-SETUP.md, passo 7). */
window.CLINICNOW_STRIPE = {
  start: '',
  pro: '',
  aceleracao: ''
};
