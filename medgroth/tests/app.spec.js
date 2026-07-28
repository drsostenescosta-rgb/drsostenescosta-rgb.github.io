/* Testes do cockpit (app.html):
   diagnóstico de 7 perguntas → plano gerado; CRM (adicionar lead e mover
   de etapa); persistência do checklist após reload. */
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.route('https://fonts.googleapis.com/**', r => r.abort());
  await page.route('https://fonts.gstatic.com/**', r => r.abort());
  // o signup dispara saveLead: responder localmente para o teste ser hermético
  await page.route('**/rest/v1/**', r => r.fulfill({ status: 201, body: '' }));
});

async function signup(page) {
  await page.goto('app.html');
  await expect(page.locator('#auth')).toBeVisible();
  await page.fill('#a-nome', 'Dra. Ana Teste');
  await page.fill('#a-zap', '(84) 98888-7777');
  await page.check('#a-lgpd');
  await page.click('text=Entrar no MedGroth');
  await expect(page.locator('#shell')).toBeVisible();
}

test('cadastro do app exige consentimento LGPD: sem checkbox não cria conta nem envia lead', async ({ page }) => {
  let chamadas = 0;
  await page.route('**/rest/v1/medgroth_leads**', r => { chamadas++; r.fulfill({ status: 201, body: '' }); });
  await page.goto('app.html');
  await page.fill('#a-nome', 'Dra. Ana Teste');
  await page.fill('#a-zap', '(84) 98888-7777');
  await page.click('text=Entrar no MedGroth'); // sem marcar o consentimento
  await expect(page.locator('#a-erro')).toBeVisible();
  await expect(page.locator('#a-erro')).toContainText('Política de Privacidade');
  await expect(page.locator('#shell')).toBeHidden();
  expect(chamadas).toBe(0);
});

test('contrato do payload do cadastro-app: consentimento_lgpd e politica_versao no body', async ({ page }) => {
  let req = null;
  await page.route('**/rest/v1/medgroth_leads**', r => {
    req = r.request().postDataJSON();
    r.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify([{ id: 7 }]) });
  });
  await signup(page);
  expect(req).not.toBeNull();
  expect(req.nome).toBe('Dra. Ana Teste');
  expect(req.origem).toBe('cadastro-app');
  expect(req.consentimento_lgpd).toBe(true);
  expect(req.politica_versao).toBe('1.0-2026-07');
});

async function fazDiagnostico(page) {
  await page.click('.tab:has-text("Diagnóstico")');
  await page.selectOption('#d-nicho', 'Emagrecimento');
  await page.fill('#d-ticket', '300');
  await page.fill('#d-sem', '20');
  await page.selectOption('#d-mat', 'Média');
  await page.selectOption('#d-garg', 'Precificação');
  await page.selectOption('#d-obj', 'Aumentar ticket');
  await page.selectOption('#d-quem', 'Eu mesmo(a)');
  await page.click('text=Gerar meu plano de crescimento');
}

test('diagnóstico: 7 perguntas respondidas geram o plano de 4 semanas', async ({ page }) => {
  await signup(page);
  await fazDiagnostico(page);
  await expect(page.locator('h3.grad')).toContainText('Seu plano de crescimento');
  await expect(page.getByText('Semana 1 — Fundação')).toBeVisible();
  await expect(page.getByText('Semana 4 — Retenção & LTV')).toBeVisible();

  // regressão CFM no conteúdo GERADO: nada de "resultado prometido"
  const body = await page.textContent('body');
  expect(body).not.toContain('resultado prometido');
  expect(body).toContain('resultado medido e acompanhado');
});

test('CRM: adicionar lead e movê-lo de "Novo" para "Conversando"', async ({ page }) => {
  await signup(page);
  await page.click('.tab:has-text("Leads")');
  await page.fill('#l-nome', 'Maria Lima');
  await page.fill('#l-zap', '(84) 97777-6666');
  await page.click('text=+ Adicionar lead');

  const colNovo = page.locator('.kol', { hasText: 'Novo' }).first();
  await expect(colNovo.locator('.lead b')).toContainText('Maria Lima');

  await colNovo.locator('.lead .acts button', { hasText: '▶' }).click();

  const colConversando = page.locator('.kol', { hasText: 'Conversando' }).first();
  await expect(colConversando.locator('.lead b')).toContainText('Maria Lima');
  await expect(colNovo.locator('.lead')).toHaveCount(0);
});

test('checklist do plano persiste após reload da página', async ({ page }) => {
  await signup(page);
  await fazDiagnostico(page);

  const primeira = page.locator('.chk input[type="checkbox"]').first();
  await primeira.check();
  await expect(page.locator('.chk input[type="checkbox"]').first()).toBeChecked();

  await page.reload();
  await expect(page.locator('#shell')).toBeVisible();
  await page.click('.tab:has-text("Plano")');
  await expect(page.locator('.chk input[type="checkbox"]').first()).toBeChecked();

  // e o painel reflete o progresso (1 ação concluída)
  await page.click('.tab:has-text("Painel")');
  await expect(page.getByText(/1 de \d+ ações concluídas/)).toBeVisible();
});
