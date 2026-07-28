/* Regressão estática nos artefatos publicados do ClinicNow:
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
    expect(txt.includes('resultado prometido'), `"resultado prometido" encontrado em clinicnow/${f}`).toBe(false);
  }
});

test('páginas de venda/captura sem escassez fabricada', async () => {
  for (const f of ['index.html', 'captura.html']) {
    const txt = fs.readFileSync(path.join(DIR, f), 'utf8');
    for (const proibido of ['20 primeiras', 'primeiras 20', 'vagas limitadas', 'Aplicar para uma vaga']) {
      expect(txt.includes(proibido), `"${proibido}" encontrado em clinicnow/${f}`).toBe(false);
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
    expect(txt.includes(proibido), `"${proibido}" encontrado em clinicnow/app.html`).toBe(false);
  }
  // o campo dos protocolos chama-se "proposta" — "promessa:" reintroduziria o vocabulário proibido no código
  expect(/promessa\s*:/.test(txt), 'campo "promessa:" encontrado em clinicnow/app.html').toBe(false);
});

test('mock do hero em index.html declara "exemplo ilustrativo" junto ao número', async () => {
  const txt = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
  expect(txt).toContain('exemplo ilustrativo');
});

test('FAQ CFM sem o absoluto "Tudo que o ClinicNow recomenda"', async () => {
  const txt = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
  expect(txt.includes('Tudo que o ClinicNow recomenda')).toBe(false);
});

test('captura: e-mail obrigatório (required) e honeypot presentes no HTML', async () => {
  const txt = fs.readFileSync(path.join(DIR, 'captura.html'), 'utf8');
  expect(txt).toMatch(/<input[^>]*id="email"[^>]*required[^>]*>/);
  expect(txt).toContain('id="hp-site"');
});

test('versão única da política: "1.1-2026-07" em config.js e exibida em privacidade.html', async () => {
  expect(fs.readFileSync(path.join(DIR, 'config.js'), 'utf8')).toContain("politicaVersao: '1.1-2026-07'");
  expect(fs.readFileSync(path.join(DIR, 'privacidade.html'), 'utf8')).toContain('Versão 1.1-2026-07');
  // captura e app usam a fonte única (nenhuma versão hardcoded divergente)
  expect(fs.readFileSync(path.join(DIR, 'captura.html'), 'utf8')).toContain('CLINICNOW.politicaVersao');
  expect(fs.readFileSync(path.join(DIR, 'app.html'), 'utf8')).toContain('CLINICNOW.politicaVersao');
});

/* ---- Decisão do Founder (2026-07-28): migração de marca MedGroth → ClinicNow ---- */

test('marca: nenhum artefato servido contém a marca antiga (allowlist: nota de transição nos docs legais)', async () => {
  // Allowlist: os documentos legais citam "anteriormente MedGroth" UMA vez cada,
  // por transparência da transição de marca. Nada além disso pode conter a marca antiga.
  const ALLOW = { 'privacidade.html': 1, 'termos-beta.html': 1 };
  const arquivos = [...ARTEFATOS.map(f => ({ nome: `clinicnow/${f}`, caminho: path.join(DIR, f), allow: ALLOW[f] || 0 })),
                    { nome: 'index.html (raiz)', caminho: path.join(DIR, '..', 'index.html'), allow: 0 }];
  for (const a of arquivos) {
    let txt = fs.readFileSync(a.caminho, 'utf8');
    const notas = (txt.match(/anteriormente MedGroth/g) || []).length;
    expect(notas, `nota de transição em ${a.nome}: esperado ${a.allow}, encontrado ${notas}`).toBe(a.allow);
    txt = txt.replace(/anteriormente MedGroth/g, '');
    expect(/medgroth/i.test(txt), `marca antiga "MedGroth" encontrada em ${a.nome} fora da nota de transição`).toBe(false);
  }
});

test('marca: identidade ClinicNow presente (nome, monograma CN, global JS, chaves de storage, tabela)', async () => {
  const index = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
  expect(index).toContain('ClinicNow');
  expect(index).toContain('Clinic. Up. Now.');           // assinatura de lançamento no hero
  expect(index).toContain('class="logo">CN<');           // monograma novo
  expect(index.includes('class="logo">Mg<')).toBe(false);
  const config = fs.readFileSync(path.join(DIR, 'config.js'), 'utf8');
  expect(config).toContain('window.CLINICNOW');
  expect(config).toContain("rest('clinicnow_leads')");   // tabela nova no Supabase
  expect(config).toContain("localStorage.getItem('clinicnow_leads'");
  expect(fs.readFileSync(path.join(DIR, 'app.html'), 'utf8')).toContain("'clinicnow_db'");
  expect(fs.readFileSync(path.join(DIR, 'captura.html'), 'utf8')).toContain('clinicnow_prefill');
});

/* ---- Decisão do Founder (2026-07-28): ICP ampliado para profissionais da saúde ---- */

test('ICP ampliado: index fala com profissionais da saúde, não restringe a médicos', async () => {
  const index = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
  expect(index).toContain('profissionais da saúde');
  // headline/eyebrow antigos restritos a médicos não podem renascer
  expect(index.includes('máquina de crescimento para médicos')).toBe(false);
  expect(index.includes('Para médicos e clínicas que querem crescer')).toBe(false);
  // FAQ generalizada para os conselhos (não só CFM)
  expect(index).toContain('COFFITO');
});

test('ICP ampliado: captura oferece os novos nichos no select de especialidade', async () => {
  const cap = fs.readFileSync(path.join(DIR, 'captura.html'), 'utf8');
  for (const nicho of ['Fisioterapia', 'Nutrição', 'Odontologia', 'Enfermagem / Clínica de enfermagem',
                       'Estética avançada / Biomedicina', 'Clínica multiprofissional (dono/gestor)']) {
    expect(cap.includes(nicho), `nicho "${nicho}" ausente do select de captura.html`).toBe(true);
  }
});

test('ICP ampliado: app tem PROTOCOLOS e opção de diagnóstico para cada novo nicho', async () => {
  const app = fs.readFileSync(path.join(DIR, 'app.html'), 'utf8');
  for (const nicho of ['Fisioterapia', 'Nutrição', 'Odontologia', 'Enfermagem / Clínica de enfermagem',
                       'Estética avançada / Biomedicina', 'Clínica multiprofissional (dono/gestor)']) {
    // chave nos PROTOCOLOS (proposta de valor equivalente aos nichos originais)
    expect(app.includes(`'${nicho}':[`), `PROTOCOLOS['${nicho}'] ausente em app.html`).toBe(true);
  }
  // guarda-corpo generalizado: a regra vale para todos os conselhos, não só CFM
  expect(app).toContain('COFFITO');
  // cada novo protocolo usa o campo "proposta" (o veto ao campo "promessa" já é coberto pelo teste CFM acima)
  const novos = app.match(/'(Fisioterapia|Nutrição|Odontologia|Enfermagem \/ Clínica de enfermagem|Estética avançada \/ Biomedicina|Clínica multiprofissional \(dono\/gestor\))':\[[^\]]*\]/g) || [];
  expect(novos.length).toBeGreaterThanOrEqual(6);
  for (const bloco of novos) expect(bloco).toContain('proposta:');
});

/* ---- Decisão do Founder (2026-07-28): assinatura anual ---- */

test('preços anuais: os 3 valores (R$ 970, R$ 2.970, R$ 9.970) por ano no index, sem os mensais antigos', async () => {
  const index = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
  for (const preco of ['R$ 970<small>/ano</small>', 'R$ 2.970<small>/ano</small>', 'R$ 9.970<small>/ano</small>']) {
    expect(index.includes(preco), `preço anual "${preco}" ausente de index.html`).toBe(true);
  }
  // equivalente mensal como apoio + nota honesta de preço de lançamento
  expect((index.match(/equivale a R\$ \d+\/mês/g) || []).length).toBe(3);
  expect(index).toContain('Preço de lançamento');
  expect(index).toContain('não afetam assinaturas ativas');
  // os preços mensais antigos não podem renascer na página de venda
  for (const antigo of ['R$ 97<small>/mês</small>', 'R$ 297<small>/mês</small>', 'R$ 997<small>/mês</small>']) {
    expect(index.includes(antigo), `preço mensal antigo "${antigo}" reapareceu em index.html`).toBe(false);
  }
});

test('termos: ciclo anual, reajuste só na renovação com aviso de 30 dias, CDC art. 49 mantido', async () => {
  const termos = fs.readFileSync(path.join(DIR, 'termos-beta.html'), 'utf8');
  expect(termos).toContain('assinatura anual');
  expect(termos).toContain('Cobrança anual antecipada');
  expect(termos.includes('assinatura mensal')).toBe(false);
  expect(termos.includes('Cobrança mensal')).toBe(false);
  expect(termos).toContain('pelo menos 30 dias de antecedência');
  expect(termos).toContain('mantêm o preço contratado até a renovação seguinte');
  expect(termos).toContain('art. 49');
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
