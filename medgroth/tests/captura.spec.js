/* Testes da página de captura (captura.html):
   validação, consentimento LGPD obrigatório e o fluxo HONESTO de envio —
   sucesso só quando o insert remoto confirma; falha mostra mensagem honesta
   com fallback de WhatsApp, mantendo o backup local. */
const { test, expect } = require('@playwright/test');

const SUPABASE = '**/rest/v1/medgroth_leads**';

test.beforeEach(async ({ page }) => {
  // testes herméticos: nada de fontes externas atrasando o load
  await page.route('https://fonts.googleapis.com/**', r => r.abort());
  await page.route('https://fonts.gstatic.com/**', r => r.abort());
});

async function preencheBasico(page) {
  await page.fill('#nome', 'Dra. Teste Playwright');
  await page.fill('#whatsapp', '(84) 99999-0000');
}

test('validação: sem nome/WhatsApp mostra erro e não mostra obrigado', async ({ page }) => {
  let chamadas = 0;
  await page.route(SUPABASE, r => { chamadas++; r.fulfill({ status: 201, body: '' }); });
  await page.goto('captura.html');
  await page.click('#enviar');
  await expect(page.locator('#erro')).toBeVisible();
  await expect(page.locator('#erro')).toContainText('nome e WhatsApp');
  await expect(page.locator('#obrigado')).toBeHidden();
  expect(chamadas).toBe(0);
});

test('LGPD: checkbox obrigatório com link para privacidade.html; desmarcado bloqueia o envio', async ({ page }) => {
  let chamadas = 0;
  await page.route(SUPABASE, r => { chamadas++; r.fulfill({ status: 201, body: '' }); });
  await page.goto('captura.html');
  await expect(page.locator('.lgpd a[href="privacidade.html"]')).toBeVisible();
  await preencheBasico(page);
  await page.click('#enviar'); // sem marcar o checkbox
  await expect(page.locator('#erro')).toBeVisible();
  await expect(page.locator('#erro')).toContainText('Política de Privacidade');
  await expect(page.locator('#obrigado')).toBeHidden();
  expect(chamadas).toBe(0);
});

test('sucesso: insert remoto confirmado (201) → tela de cadastro recebido', async ({ page }) => {
  await page.route(SUPABASE, r => r.fulfill({ status: 201, body: '' }));
  await page.goto('captura.html');
  await preencheBasico(page);
  await page.check('#lgpd');
  await page.click('#enviar');
  await expect(page.locator('#obrigado')).toBeVisible();
  await expect(page.locator('#obrigado h2')).toContainText('Cadastro recebido');
  await expect(page.locator('#falha')).toBeHidden();
});

test('falha de rede: mensagem honesta, fallback de WhatsApp, backup local e "tentar novamente"', async ({ page }) => {
  await page.route(SUPABASE, r => r.abort('failed'));
  await page.goto('captura.html');
  await preencheBasico(page);
  await page.check('#lgpd');
  await page.click('#enviar');

  // NUNCA "Cadastro recebido" quando o remoto falhou (anti success-theater)
  await expect(page.locator('#falha')).toBeVisible();
  await expect(page.locator('#falha h2')).toContainText('Não conseguimos registrar agora');
  await expect(page.locator('#obrigado')).toBeHidden();

  const href = await page.getAttribute('#zap-falha', 'href');
  expect(href).toContain('wa.me');

  // backup local preservado (lead não se perde)
  const backup = await page.evaluate(() => JSON.parse(localStorage.getItem('medgroth_leads') || '[]'));
  expect(backup.length).toBe(1);
  expect(backup[0].nome).toBe('Dra. Teste Playwright');

  // "tentar novamente" devolve o formulário utilizável
  await page.click('#tentar');
  await expect(page.locator('#captura')).toBeVisible();
  await expect(page.locator('#enviar')).toBeEnabled();
});

test('falha HTTP (500) também mostra a mensagem honesta — status não-2xx não é sucesso', async ({ page }) => {
  await page.route(SUPABASE, r => r.fulfill({ status: 500, contentType: 'application/json', body: '{}' }));
  await page.goto('captura.html');
  await preencheBasico(page);
  await page.check('#lgpd');
  await page.click('#enviar');
  await expect(page.locator('#falha')).toBeVisible();
  await expect(page.locator('#obrigado')).toBeHidden();
});
