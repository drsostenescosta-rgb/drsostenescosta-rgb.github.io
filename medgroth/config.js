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
  /* Analytics primária (LGPD by design): registra só página + domínio de origem.
     Sem cookie, sem IP armazenado pela aplicação, sem identificador de pessoa. */
  track: function (pagina) {
    try {
      var ref = '';
      try { ref = document.referrer ? new URL(document.referrer).hostname : ''; } catch (e) {}
      fetch(this.rest('docgrow_pageviews'), {
        method: 'POST',
        headers: this.headers({ 'Prefer': 'return=minimal' }),
        body: JSON.stringify({ pagina: pagina, ref: ref || null })
      }).catch(function () {});
    } catch (e) {}
  },
  /* Salva um lead: tenta o banco real; se falhar (offline / tabela ainda não
     publicada), guarda na fila local e devolve {ok, remote}. Nunca perde lead. */
  saveLead: function (lead) {
    var self = this;
    lead = Object.assign({ origem: 'site', criado_em: new Date().toISOString() }, lead);
    var local = JSON.parse(localStorage.getItem('medgroth_leads') || '[]');
    local.push(lead);
    localStorage.setItem('medgroth_leads', JSON.stringify(local));
    return fetch(self.rest('medgroth_leads'), {
      method: 'POST',
      headers: self.headers({ 'Prefer': 'return=minimal' }),
      body: JSON.stringify({
        nome: lead.nome, whatsapp: lead.whatsapp, email: lead.email || null,
        especialidade: lead.especialidade || null, faturamento: lead.faturamento || null,
        origem: lead.origem, respostas: lead.respostas || null
      })
    }).then(function (r) { return { ok: true, remote: r.ok }; })
      .catch(function () { return { ok: true, remote: false }; });
  }
};
