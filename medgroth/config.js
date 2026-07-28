/* MedGroth · configuração do backend (Supabase — mesmo projeto do SosMed)
   A chave abaixo é PUBLISHABLE (segura para o navegador): o que cada pessoa
   pode ler/gravar é controlado por Row Level Security no banco. */
window.MEDGROTH = {
  url: 'https://yaqphldowpshhrtvvfaq.supabase.co',
  key: 'sb_publishable_V64ejsDNKclPdFlqymghnQ_jUr5ivj1',
  whatsapp: '5584999869468',
  rest: function (path) { return this.url + '/rest/v1/' + path; },
  headers: function (extra) {
    var h = { 'apikey': this.key, 'Authorization': 'Bearer ' + this.key, 'Content-Type': 'application/json' };
    for (var k in (extra || {})) h[k] = extra[k];
    return h;
  },
  /* Versão vigente da Política de Privacidade — manter em sincronia com o
     identificador exibido em privacidade.html. */
  politicaVersao: '1.0-2026-07',
  /* Salva um lead: guarda uma cópia local (backup, nunca perde lead) e tenta
     o banco real. O resultado é HONESTO: ok=true só quando o insert remoto
     confirmou. Falha remota devolve {ok:false, remote:false} — quem chama
     decide o que mostrar ao usuário. Com `Prefer: return=representation` o
     banco devolve a linha criada: o `id` volta no resultado e é gravado no
     backup local (correlação futura lead → plano → e-mail). */
  saveLead: function (lead) {
    var self = this;
    lead = Object.assign({ origem: 'site', criado_em: new Date().toISOString() }, lead);
    var local = JSON.parse(localStorage.getItem('medgroth_leads') || '[]');
    local.push(lead);
    localStorage.setItem('medgroth_leads', JSON.stringify(local));
    return fetch(self.rest('medgroth_leads'), {
      method: 'POST',
      headers: self.headers({ 'Prefer': 'return=representation' }),
      body: JSON.stringify({
        nome: lead.nome, whatsapp: lead.whatsapp, email: lead.email || null,
        especialidade: lead.especialidade || null, faturamento: lead.faturamento || null,
        origem: lead.origem, respostas: lead.respostas || null,
        consentimento_lgpd: lead.consentimento_lgpd === true,
        politica_versao: lead.politica_versao || null
      })
    }).then(function (r) {
      if (!r.ok) return { ok: false, remote: false };
      return r.json().then(function (rows) {
        var id = (rows && rows[0] && rows[0].id !== undefined) ? rows[0].id : null;
        if (id !== null) {
          lead.id = id;
          local[local.length - 1] = lead;
          localStorage.setItem('medgroth_leads', JSON.stringify(local));
        }
        return { ok: true, remote: true, id: id };
      }).catch(function () { return { ok: true, remote: true, id: null }; });
    }).catch(function () { return { ok: false, remote: false }; });
  }
};
