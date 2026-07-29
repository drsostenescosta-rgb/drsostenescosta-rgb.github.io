/* Regressão da NOVA OFERTA (ordem do Founder, 2026-07-29):
   - preços R$ 297/697/997 por mês, cobrança anual, TOTAL ANUAL visível (CDC art. 31);
   - mentoria de implementação + suporte anual em todos os planos, escalonados com
     honestidade (Start sem mentoria mensal; 1:1 só no Aceleração, limitado pela
     agenda real);
   - termos (fonte vinculante — L5) carregam os mesmos valores e a cláusula 2.5;
   - CTAs dos planos: Payment Link do Stripe quando existir, fallback honesto
     para captura quando vazio (nunca botão quebrado, nunca rótulo mentiroso). */
const fs = require('fs');
const path = require('path');
const { test, expect } = require('@playwright/test');

const DIR = path.resolve(__dirname, '..');
const ler = f => fs.readFileSync(path.join(DIR, f), 'utf8');

const PRECOS = [
  { plano: 'start', mensal: 'R$ 297<small>/mês</small>', anual: 'R$ 3.564/ano' },
  { plano: 'pro', mensal: 'R$ 697<small>/mês</small>', anual: 'R$ 8.364/ano' },
  { plano: 'aceleracao', mensal: 'R$ 997<small>/mês</small>', anual: 'R$ 11.964/ano' },
];

test('planos: mensal como principal e total anual visível em cada um (CDC art. 31)', async () => {
  const index = ler('index.html');
  for (const p of PRECOS) {
    expect(index.includes(p.mensal), `preço mensal "${p.mensal}" ausente de index.html`).toBe(true);
    expect(index.includes(p.anual), `total anual "${p.anual}" ausente de index.html`).toBe(true);
  }
  // cada plano declara a forma de cobrança junto do preço — 3 vezes, uma por plano
  expect((index.match(/cobrado anualmente — total de/g) || []).length).toBe(3);
});

test('oferta: mentoria de implementação + suporte anual presentes e escalonados com honestidade', async () => {
  const index = ler('index.html');
  expect(index).toContain('mentoria de implementação e suporte para dúvidas e ajustes durante todo o ano');
  const blocos = index.split('<div class="plan');
  const start = blocos.find(b => b.includes('ClinicNow Start'));
  const pro = blocos.find(b => b.includes('ClinicNow Pro'));
  const acel = blocos.find(b => b.includes('ClinicNow Aceleração'));
  // Start: onboarding em grupo + suporte anual; mentoria mensal explicitamente FORA
  expect(start).toContain('onboarding ao vivo, em grupo');
  expect(start).toContain('Suporte por WhatsApp e e-mail durante todo o ano');
  expect(start).toContain('<li class="no">Mentoria mensal (em grupo ou 1:1)</li>');
  // Pro: mentoria em grupo mensal + prioridade; nada de 1:1 prometido
  expect(pro).toContain('Mentoria de implementação em grupo');
  expect(pro).toContain('Prioridade no suporte');
  expect(pro.includes('1:1')).toBe(false);
  // Aceleração: 1:1 com o fundador, escassez VERDADEIRA (agenda real), ajustes assistidos
  expect(acel).toContain('Mentoria 1:1 com o fundador');
  expect(acel).toContain('agenda real do fundador');
  expect(acel).toContain('Ajustes assistidos');
});

test('termos (L5, fonte vinculante): valores 2.4 e cláusula 2.5 de mentoria/suporte com limites honestos', async () => {
  const termos = ler('termos-beta.html');
  for (const trecho of ['R$ 297/mês', 'R$ 697/mês', 'R$ 997/mês',
                        'R$ 3.564/ano', 'R$ 8.364/ano', 'R$ 11.964/ano',
                        'art. 31']) {
    expect(termos.includes(trecho), `"${trecho}" ausente de termos-beta.html`).toBe(true);
  }
  expect(termos).toContain('Mentoria de implementação e suporte');
  expect(termos).toContain('horário comercial');
  expect(termos).toContain('mediante agendamento');
  expect(termos).toContain('agenda real');
  expect(termos).toContain('não é serviço de agência');
  // a oferta da página não pode prometer o que os termos não cobrem: versão nova publicada
  expect(termos).toContain('Versão 1.2');
});

test('stripe-links.js: fonte única com as 3 chaves e instrução de fallback', async () => {
  expect(fs.existsSync(path.join(DIR, 'stripe-links.js'))).toBe(true);
  const js = ler('stripe-links.js');
  expect(js).toContain('window.CLINICNOW_STRIPE');
  for (const chave of ['start:', 'pro:', 'aceleracao:']) {
    expect(js.includes(chave), `chave "${chave}" ausente de stripe-links.js`).toBe(true);
  }
  expect(js).toContain('fallback');
  // e o index carrega e consome a fonte única
  const index = ler('index.html');
  expect(index).toContain('src="stripe-links.js"');
  for (const p of PRECOS) {
    expect(index.includes(`data-plano="${p.plano}"`), `CTA data-plano="${p.plano}" ausente`).toBe(true);
    expect(index.includes(`captura.html?plano=${p.plano}`), `fallback captura.html?plano=${p.plano} ausente`).toBe(true);
  }
  expect((index.match(/data-label-checkout=/g) || []).length).toBe(3);
});

test('CTA fallback no navegador: sem Payment Link, botões levam à captura com rótulo honesto', async ({ page }) => {
  await page.goto('index.html');
  const pro = page.locator('a[data-plano="pro"]');
  await expect(pro).toHaveAttribute('href', /captura\.html\?plano=pro$/);
  await expect(pro).toHaveText('Quero o Pro →'); // rótulo NÃO promete checkout que não existe
  await expect(page.locator('a[data-plano="start"]')).toHaveAttribute('href', /captura\.html\?plano=start$/);
  await expect(page.locator('a[data-plano="aceleracao"]')).toHaveAttribute('href', /captura\.html\?plano=aceleracao$/);
});

test('CTA com Payment Link preenchido: botão vira checkout e troca o rótulo', async ({ page }) => {
  // injeta um link fake ANTES de stripe-links.js rodar, simulando o Founder
  // tendo colado o Payment Link — o comportamento do index tem que reagir.
  await page.route('**/stripe-links.js', route => route.fulfill({
    contentType: 'application/javascript',
    body: "window.CLINICNOW_STRIPE={start:'',pro:'https://buy.stripe.com/test_fake',aceleracao:''};",
  }));
  await page.goto('index.html');
  const pro = page.locator('a[data-plano="pro"]');
  await expect(pro).toHaveAttribute('href', 'https://buy.stripe.com/test_fake');
  await expect(pro).toHaveText('Assinar o Pro agora →');
  // os outros continuam no fallback
  await expect(page.locator('a[data-plano="start"]')).toHaveAttribute('href', /captura\.html\?plano=start$/);
});

test('página long-form: as 16 seções da estrutura remodelada (benchmarks) presentes e na ordem', async () => {
  const index = ler('index.html');
  const ordem = ['class="hero"', 'id="fatos"', 'id="dor"', 'id="metodo"', 'id="demo"',
                 'id="recebe"', 'id="ecossistema"', 'id="roi"', 'id="comparativo"',
                 'id="paraquem"', 'id="planos"', 'id="garantia"', 'id="conformidade"',
                 'id="prova"', 'id="faq"', 'class="cta-final"'];
  let pos = -1;
  for (const marca of ordem) {
    const i = index.indexOf(marca);
    expect(i, `seção "${marca}" ausente de index.html`).toBeGreaterThan(-1);
    expect(i, `seção "${marca}" fora de ordem`).toBeGreaterThan(pos);
    pos = i;
  }
  // dor nomeada por vertical (amostra) + garantia CDC + para quem não é
  for (const v of ['Dentista', 'Fisioterapeuta', 'Nutricionista', 'Enfermagem']) {
    expect(index.includes(v), `vertical "${v}" ausente da seção de dor`).toBe(true);
  }
  expect(index).toContain('art. 49');
  expect(index).toContain('Não é para você se');
});
