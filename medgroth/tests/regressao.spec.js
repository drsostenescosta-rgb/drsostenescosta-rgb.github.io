/* Regressão estática nos artefatos publicados do MedGroth:
   - "resultado prometido" banido de todo arquivo servido ao usuário (CFM).
     Docs internos (TESTES.md, juridico/, campanha/) podem CITAR a frase
     vetada para documentá-la — por isso o escopo é só .html/.js;
   - escassez fabricada ("20 primeiras" / "vagas limitadas") banida das
     páginas de venda e captura;
   - planos pagos: features futuras marcadas visualmente como "em breve". */
const fs = require('fs');
const path = require('path');
const { test, expect } = require('@playwright/test');

const DIR = path.resolve(__dirname, '..');
const ARTEFATOS = fs.readdirSync(DIR).filter(f => /\.(html|js)$/.test(f));

test('nenhum artefato servido ao usuário contém "resultado prometido"', async () => {
  for (const f of ARTEFATOS) {
    const txt = fs.readFileSync(path.join(DIR, f), 'utf8');
    expect(txt.includes('resultado prometido'), `"resultado prometido" encontrado em medgroth/${f}`).toBe(false);
  }
});

test('páginas de venda/captura sem escassez fabricada', async () => {
  for (const f of ['index.html', 'captura.html']) {
    const txt = fs.readFileSync(path.join(DIR, f), 'utf8');
    for (const proibido of ['20 primeiras', 'primeiras 20', 'vagas limitadas', 'Aplicar para uma vaga']) {
      expect(txt.includes(proibido), `"${proibido}" encontrado em medgroth/${f}`).toBe(false);
    }
  }
});

test('planos pagos: features inexistentes marcadas como "em breve"', async () => {
  const txt = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
  expect(txt).toContain('class="soon"');
  expect(txt.match(/soon-tag/g).length).toBeGreaterThanOrEqual(2);
  expect(txt).toMatch(/Scripts de conversão e recall prontos\s*<span class="soon-tag">em breve<\/span>/);
  expect(txt).toMatch(/Integração com MedEasy[^<]*<span class="soon-tag">em breve<\/span>/);
});

test('captura exige consentimento LGPD no HTML (checkbox + link)', async () => {
  const txt = fs.readFileSync(path.join(DIR, 'captura.html'), 'utf8');
  expect(txt).toContain('id="lgpd"');
  expect(txt).toContain('href="privacidade.html"');
});

test('app.html sem vocabulário de desfecho clínico (CFM) nem campo "promessa"', async () => {
  const txt = fs.readFileSync(path.join(DIR, 'app.html'), 'utf8').toLowerCase();
  for (const proibido of ['sair da dor', 'resultado estético', 'reduzir ansiedade', 'resultado prometido']) {
    expect(txt.includes(proibido), `"${proibido}" encontrado em medgroth/app.html`).toBe(false);
  }
  // o campo dos protocolos chama-se "proposta" — "promessa:" reintroduziria o vocabulário proibido no código
  expect(/promessa\s*:/.test(txt), 'campo "promessa:" encontrado em medgroth/app.html').toBe(false);
});

test('mock do hero em index.html declara "exemplo ilustrativo" junto ao número', async () => {
  const txt = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
  expect(txt).toContain('exemplo ilustrativo');
});

test('FAQ CFM sem o absoluto "Tudo que o MedGroth recomenda"', async () => {
  const txt = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
  expect(txt.includes('Tudo que o MedGroth recomenda')).toBe(false);
});

test('captura: e-mail obrigatório (required) e honeypot presentes no HTML', async () => {
  const txt = fs.readFileSync(path.join(DIR, 'captura.html'), 'utf8');
  expect(txt).toMatch(/<input[^>]*id="email"[^>]*required[^>]*>/);
  expect(txt).toContain('id="hp-site"');
});

test('versão única da política: "1.0-2026-07" em config.js e exibida em privacidade.html', async () => {
  expect(fs.readFileSync(path.join(DIR, 'config.js'), 'utf8')).toContain("politicaVersao: '1.0-2026-07'");
  expect(fs.readFileSync(path.join(DIR, 'privacidade.html'), 'utf8')).toContain('Versão 1.0-2026-07');
  // captura e app usam a fonte única (nenhuma versão hardcoded divergente)
  expect(fs.readFileSync(path.join(DIR, 'captura.html'), 'utf8')).toContain('MEDGROTH.politicaVersao');
  expect(fs.readFileSync(path.join(DIR, 'app.html'), 'utf8')).toContain('MEDGROTH.politicaVersao');
});

test('termos-beta.html publicado e linkado no footer junto da privacidade', async () => {
  expect(fs.existsSync(path.join(DIR, 'termos-beta.html'))).toBe(true);
  const termos = fs.readFileSync(path.join(DIR, 'termos-beta.html'), 'utf8');
  expect(termos).toContain('Termos de Uso');
  expect(termos).toContain('href="privacidade.html"');
  const index = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
  expect(index).toContain('href="termos-beta.html"');
  expect(index).toContain('href="privacidade.html"');
  expect(fs.readFileSync(path.join(DIR, 'privacidade.html'), 'utf8')).toContain('href="termos-beta.html"');
});
