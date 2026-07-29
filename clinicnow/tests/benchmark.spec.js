/* Remodelagem da página de vendas (ordem do Founder, 2026-07-29):
   estrutura clonada do MODELO dos benchmarks (mdhub/Emma + Treint) com os
   pontos cegos que NENHUM deles cobre — spec em specs/BENCHMARK-PAGINA.md.
   Estes testes travam os pontos cegos para que uma edição futura não os
   regrida ao padrão covarde do mercado (preço escondido, demo com vendedor,
   percentuais sem premissa, selo de conformidade fake). A ORDEM das seções
   é coberta em oferta.spec.js; aqui vai o CONTEÚDO de cada ponto cego. */
const fs = require('fs');
const path = require('path');
const { test, expect } = require('@playwright/test');

const DIR = path.resolve(__dirname, '..');
const ler = f => fs.readFileSync(path.join(DIR, f), 'utf8');

test('barra de fatos: números verificáveis do sistema, e declaração explícita de beta sem prova social alugada', async () => {
  const index = ler('index.html');
  const fatos = index.split('id="fatos"')[1].split('</section>')[0];
  for (const fato of ['3 min', '4 semanas', 'R$ na página', '7 dias', 'mentoria + suporte']) {
    expect(fatos.includes(fato), `fato "${fato}" ausente da barra de fatos`).toBe(true);
  }
  // anti-prova-social-fake: a página ASSUME o beta em vez de alugar logos
  expect(fatos).toContain('beta fundador');
  expect(fatos).toContain('logos de clientes alugados');
});

test('produto aberto (anti "book a demo"): cockpit real linkado, sem call de vendas', async () => {
  const index = ler('index.html');
  const demo = index.split('id="demo"')[1].split('</section>')[0];
  expect(demo).toContain('href="app.html"');
  expect(demo).toContain('href="captura.html"');
  expect(demo).toContain('sem call de vendas');
  // o hero aponta para a demo real como CTA secundário
  const hero = index.split('class="hero"')[1].split('</section>')[0];
  expect(hero).toContain('href="#demo"');
});

test('ecossistema: MedEasy como módulo com Índice de Saúde e integração marcada "em breve" (L5)', async () => {
  const index = ler('index.html');
  const eco = index.split('id="ecossistema"')[1].split('</section>')[0];
  expect(eco).toContain('MedEasy');
  expect(eco).toContain('Índice de Saúde');
  expect(eco).toContain('medido');
  // a integração NÃO pode ser vendida como pronta antes da v1
  expect(eco).toMatch(/em implantação\s*<span class="soon-tag">em breve<\/span>/);
  expect(eco).toContain('nunca prometido');
});

test('calculadora honesta: premissas editáveis, fórmula impressa e aviso de estimativa', async () => {
  const index = ler('index.html');
  const roi = index.split('id="roi"')[1].split('</section>')[0];
  for (const id of ['roi-leads', 'roi-ticket', 'roi-pontos', 'roi-total']) {
    expect(roi.includes(`id="${id}"`), `elemento "${id}" ausente da calculadora`).toBe(true);
  }
  expect(roi).toContain('contatos × pontos recuperados × ticket'); // fórmula visível
  expect(roi).toContain('estimativa ilustrativa');
  expect(roi).toContain('não é projeção nossa nem garantia de resultado');
  expect(roi).toContain('Premissa sua');
});

test('calculadora no navegador: mudar premissa recalcula na hora (aritmética do usuário, não nossa)', async ({ page }) => {
  await page.goto('index.html');
  // defaults: 20 contatos × 10% × R$ 250 = R$ 500/mês
  await expect(page.locator('#roi-total')).toHaveText('R$ 500/mês');
  await page.fill('#roi-leads', '40');
  await page.fill('#roi-ticket', '300');
  await page.fill('#roi-pontos', '5');
  // 40 × 5% × 300 = R$ 600/mês, 2 pacientes
  await expect(page.locator('#roi-total')).toHaveText('R$ 600/mês');
  await expect(page.locator('#roi-detalhe')).toContainText('2 paciente');
  // entrada absurda não explode nem vira NaN
  await page.fill('#roi-pontos', '999');
  await expect(page.locator('#roi-total')).not.toContainText('NaN');
});

test('comparativo: 4 colunas reais e a linha honesta "quando a agência é a melhor escolha"', async () => {
  const index = ler('index.html');
  const cmp = index.split('id="comparativo"')[1].split('</section>')[0];
  for (const col of ['ClinicNow', 'Agência de marketing', 'Curso / mentoria gravada', 'Sozinho, no improviso']) {
    expect(cmp.includes(col), `coluna "${col}" ausente do comparativo`).toBe(true);
  }
  for (const linha of ['Investimento típico', 'Quem executa', 'Onde o plano vive', 'Prova de valor clínica', 'Compromisso']) {
    expect(cmp.includes(linha), `linha "${linha}" ausente do comparativo`).toBe(true);
  }
  // a honestidade que nenhum benchmark tem: admitir quando NÃO somos a escolha
  expect(cmp).toContain('Quando a agência é a melhor escolha');
  expect(cmp).toContain('não somos ela');
});

test('conformidade: LGPD + conselhos como seção própria, com nota anti-selo-falso', async () => {
  const index = ler('index.html');
  const conf = index.split('id="conformidade"')[1].split('</section>')[0];
  expect(conf).toContain('LGPD');
  for (const conselho of ['CFM', 'COFFITO', 'COREN', 'CFN', 'CFO', 'CFBM']) {
    expect(conf.includes(conselho), `conselho "${conselho}" ausente da seção de conformidade`).toBe(true);
  }
  expect(conf).toContain('href="privacidade.html"');
  expect(conf).toContain('href="termos-beta.html"');
  expect(conf).toContain('art. 49');
  // não fingimos certificação: a seção declara isso em texto
  expect(conf).toContain('não exibimos certificações que não temos');
  // e não reivindica selos internacionais como se fossem nossos
  expect(/somos\s+(HIPAA|SOC)/i.test(conf)).toBe(false);
});

test('preço transparente como argumento: microcopy "por que o preço está na página" junto dos planos', async () => {
  const index = ler('index.html');
  const planos = index.split('id="planos"')[1].split('</section>')[0];
  expect(planos).toContain('Por que o preço está na página?');
});

test('keywords PT-BR adaptadas do vocabulário dos benchmarks no head', async () => {
  const head = ler('index.html').split('</head>')[0];
  for (const kw of ['crescimento de clínica', 'captação de pacientes', 'CRM para clínicas', 'receita recorrente']) {
    expect(head.includes(kw), `keyword "${kw}" ausente do head`).toBe(true);
  }
});
