# ClinicNow — Guia Stripe para o Founder (passo a passo)

> Objetivo: sair deste guia com 3 Payment Links anuais funcionando, colados em
> `stripe-links.js`, e o teste real + estorno feito ANTES de abrir o gate.
> Decisão registrada (DECISOES.md, 2026-07-28): meio de pagamento = Stripe,
> emissor fiscal = CNPJ "Dr Sos Service and Consultancy".
> **Sem trial** e **sem parcelamento prometido** enquanto não estiver configurado e testado.

## Passo 1 — Conta e ativação

1. Acesse https://dashboard.stripe.com/register e crie a conta com o e-mail da empresa.
2. Complete a ativação: dados do CNPJ (Dr Sos Service and Consultancy), conta bancária
   para repasses, endereço e verificação de identidade.
3. Confirme que a conta está em **modo produção** ("live mode") antes do passo 4 —
   links criados em modo teste não recebem dinheiro real.

## Passo 2 — Criar os 3 Produtos

Em **Product catalog → Add product**, crie exatamente estes três (um por vez):

| Produto (Name) | Price | Tipo |
|---|---|---|
| ClinicNow Start | **R$ 3.564,00 / ano** (BRL) | Recurring, Yearly |
| ClinicNow Pro | **R$ 8.364,00 / ano** (BRL) | Recurring, Yearly |
| ClinicNow Aceleração | **R$ 11.964,00 / ano** (BRL) | Recurring, Yearly |

Atenção em cada um:
- **Recurring** (recorrente), período **Yearly** (anual) — nunca "One-time".
- Moeda **BRL**.
- Os valores são o total anual (12 × 297 / 697 / 997). O site exibe o mensal
  com o total anual ao lado — os números precisam bater com os termos (seção 2.4).

## Passo 3 — Criar os 3 Payment Links

Para cada produto, em **Payment Links → New** (ou botão "Create payment link" no produto):

1. Selecione o produto/price anual correspondente.
2. **NÃO adicione free trial.** (Decisão registrada: sem trial. O arrependimento de
   7 dias do CDC já cobre o risco do cliente — está nos termos, seção 3.3.)
3. Em **After payment**, configure a página de sucesso: "Don't show confirmation page"
   → redirect para `https://drsostenescosta-rgb.github.io/clinicnow/app.html?assinatura=ok`
   (ou, enquanto o onboarding automático não existir, deixe a confirmação padrão do
   Stripe com a mensagem: "Assinatura confirmada. Você receberá o onboarding por
   WhatsApp/e-mail em até 1 dia útil.").
4. Ative **Collect customers' addresses** = billing address (nota fiscal precisa).
5. Ative **Allow promotion codes** só se for usar cupom real — hoje, não.
6. Copie a URL gerada (`https://buy.stripe.com/...`).

## Passo 4 — Colar os links no site

Abra `clinicnow/stripe-links.js` e cole cada URL no campo correspondente:

```js
window.CLINICNOW_STRIPE = {
  start: 'https://buy.stripe.com/SEU_LINK_START',
  pro: 'https://buy.stripe.com/SEU_LINK_PRO',
  aceleracao: 'https://buy.stripe.com/SEU_LINK_ACELERACAO'
};
```

Enquanto um campo estiver vazio (`''`), o botão daquele plano continua levando para
o diagnóstico/captura (fluxo atual via WhatsApp) — nada quebra.

## Passo 5 — Conferência antes de publicar

- [ ] Os 3 links abrem checkout em BRL, valor anual correto, cobrança "per year".
- [ ] Nenhum link tem trial.
- [ ] O nome do produto no checkout bate com o nome do plano no site.
- [ ] `stripe-links.js` commitado e publicado.
- [ ] Rodar a suíte de testes (`cd clinicnow/tests && npx playwright test`) — verde.

## Passo 6 — Impostos e nota fiscal (paralelo, não bloqueia o link)

- Stripe não emite NFS-e brasileira. A nota sai pelo CNPJ (Dr Sos Service and
  Consultancy) no sistema da prefeitura, por venda. Definir com o contador:
  código de serviço e rotina de emissão a cada pagamento confirmado.

## Passo 7 — Teste obrigatório do CEO-2 (gate)

Antes de divulgar qualquer link:

1. Faça **1 transação real** você mesmo (cartão pessoal) no link do Start.
2. Confirme: cobrança correta (R$ 3.564,00), e-mail de recibo do Stripe chegou,
   assinatura aparece como ativa no dashboard.
3. Faça o **estorno integral** (Payments → transação → Refund) e **cancele a
   assinatura de teste** (Subscriptions → Cancel immediately) — senão renova em 12 meses.
4. Confirme que o estorno apareceu na fatura do cartão (pode levar alguns dias —
   o registro no dashboard basta para o gate).
5. Registre o teste em DECISOES.md (data + valor + estorno ok). Só então o gate abre.

## Dúvidas frequentes

- **Parcelamento do anual?** O Payment Link padrão cobra o anual à vista no cartão.
  Parcelamento no Brasil via Stripe exige configuração específica ("Installments",
  disponibilidade varia) — enquanto não estiver configurado E testado, ninguém
  promete parcelamento em conversa ou campanha (regra já registrada no roteiro).
- **Reembolso dos 7 dias (CDC art. 49)?** Manual: Payments → Refund + cancelar a
  assinatura. Responder em até 1 dia útil.
- **Mudar preço depois?** Criar um Price novo no produto e um Payment Link novo;
  assinaturas ativas mantêm o preço antigo (é a promessa dos termos, seção 2.2).
