/* Teste e2e do funil DocGrow (Playwright).
   Rodar: python3 -m http.server 8811 --directory <raiz do repo> &
          node docgrow/e2e.js */
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }).catch(() => chromium.launch());
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !m.text().includes('net::') && !m.text().includes('Failed to load resource')) errors.push('CONSOLE: ' + m.text()); });

  const base = 'http://127.0.0.1:8811';

  // 1. onboarding do app
  await page.goto(base + '/docgrow/app.html');
  await page.fill('#a-nome', 'Dra. Teste E2E');
  await page.fill('#a-zap', '(84) 99999-0000');
  await page.fill('#a-esp', 'Endocrinologia');
  await page.selectOption('#a-nicho', 'emagrecimento');
  await page.click('text=Entrar no cockpit →');
  await page.waitForSelector('#t-cockpit', { state: 'visible' });
  console.log('onboarding OK');

  // 2. paciente
  await page.click('.tab[data-t="pacientes"]');
  await page.click('text=+ Novo paciente');
  await page.fill('#p-nome', 'João Paciente');
  await page.fill('#p-zap', '(84) 98888-7777');
  await page.click('#d-paciente button:has-text("Salvar")');
  await page.waitForSelector('#pac-list .row');
  console.log('paciente OK');

  // 3. consulta tele sem consentimento deve bloquear
  await page.click('.tab[data-t="agenda"]');
  await page.click('text=+ Nova consulta');
  await page.fill('#c-inicio', '2026-07-30T10:00');
  await page.fill('#c-valor', '350');
  await page.selectOption('#c-tipo', 'tele');
  page.once('dialog', d => { console.log('trava tele OK: ' + d.message().slice(0, 40)); d.accept(); });
  await page.click('#d-consulta button:has-text("Salvar")');
  await page.check('#c-consent');
  await page.click('#d-consulta button:has-text("Salvar")');
  await page.waitForSelector('#agenda-list .row');
  console.log('consulta OK');

  // 4. realizada + pagar
  page.on('dialog', d => d.accept());
  await page.click('#agenda-list button:has-text("Realizada")');
  await page.click('#agenda-list button:has-text("Marcar pago")');
  console.log('pagamento OK');

  // 5. protocolo + assinatura
  await page.click('.tab[data-t="assinaturas"]');
  await page.click('text=+ Novo protocolo');
  await page.fill('#pr-nome', 'Acompanhamento metabólico');
  await page.fill('#pr-inc', 'Consulta trimestral\nRevisão de exames');
  await page.fill('#pr-preco', '290');
  await page.click('#d-protocolo button:has-text("Salvar")');
  await page.click('text=+ Registrar assinatura');
  await page.click('#d-assinatura button:has-text("Ativar assinatura")');
  await page.waitForSelector('#ass-list .row');
  console.log('assinatura OK');

  // 6. follow-up pós-consulta existe? converter
  await page.click('.tab[data-t="followups"]');
  await page.waitForSelector('#fup-list .row');
  const fups = await page.$$eval('#fup-list .row', r => r.length);
  console.log('followups: ' + fups);
  await page.click('#fup-list button:has-text("Converteu")');
  await page.fill('#cv-valor', '350');
  await page.click('#d-converte button:has-text("Somar ao Cofre")');
  console.log('conversao OK');

  // 7. cockpit final
  await page.click('.tab[data-t="cockpit"]');
  const cofre = await page.textContent('#cofre-total');
  const mrr = await page.textContent('#k-mrr');
  const receita = await page.textContent('#k-receita');
  const hs = await page.textContent('#hs-ring .val');
  console.log('COCKPIT → cofre:', cofre.trim(), '| mrr:', mrr.trim(), '| receita:', receita.trim(), '| health:', hs.trim());
  await page.screenshot({ path: 'cockpit.png', fullPage: false });

  // 8. landing + demo
  await page.goto(base + '/docgrow/index.html');
  await page.fill('#demo-input', 'Sou endocrinologista, dependo de indicação e minha agenda tem buracos');
  await page.click('#demo button.btn-em');
  await page.waitForSelector('#demo-out', { state: 'visible' });
  console.log('demo OK');
  await page.screenshot({ path: 'landing.png' });

  // 9. aplicação (não envia — só valida render)
  await page.goto(base + '/docgrow/aplicacao.html');
  await page.waitForSelector('#form');
  console.log('aplicacao OK');

  // 10. painel (render do login)
  await page.goto(base + '/docgrow/painel.html');
  await page.waitForSelector('#login');
  console.log('painel OK');

  console.log(errors.length ? 'ERROS:\n' + errors.join('\n') : 'SEM ERROS DE JS');
  await browser.close();
})().catch(e => { console.error('FALHA E2E:', e.message); process.exit(1); });
