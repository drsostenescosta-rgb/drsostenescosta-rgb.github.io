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
