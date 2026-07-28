/* ClinicNow · configuração do backend (Supabase — mesmo projeto do SosMed)
   A chave abaixo é PUBLISHABLE (segura para o navegador): o que cada pessoa
   pode ler/gravar é controlado por Row Level Security no banco. */
window.CLINICNOW = {
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
  politicaVersao: '1.1-2026-07',
  /* Gera UUID no cliente: a RLS permite INSERT anon mas (corretamente) nega
     SELECT — logo `return=representation` falharia com 42501. O id nasce aqui,
     vai no body com `return=minimal`, e a correlação lead → plano → e-mail
     fica garantida sem expor leitura pública da tabela. */
  uuid: function () {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  },
  /* Salva um lead: guarda uma cópia local (backup, nunca perde lead) e tenta
     o banco real. O resultado é HONESTO: ok=true só quando o insert remoto
     confirmou. Falha remota devolve {ok:false, remote:false} — quem chama
     decide o que mostrar ao usuário. */
  saveLead: function (lead) {
    var self = this;
    lead = Object.assign({ origem: 'site', criado_em: new Date().toISOString() }, lead);
    if (!lead.id) lead.id = self.uuid();
    var local = JSON.parse(localStorage.getItem('clinicnow_leads') || '[]');
    local.push(lead);
    localStorage.setItem('clinicnow_leads', JSON.stringify(local));
    return fetch(self.rest('clinicnow_leads'), {
      method: 'POST',
      headers: self.headers({ 'Prefer': 'return=minimal' }),
      body: JSON.stringify({
        id: lead.id,
        nome: lead.nome, whatsapp: lead.whatsapp, email: lead.email || null,
        especialidade: lead.especialidade || null, faturamento: lead.faturamento || null,
        origem: lead.origem, respostas: lead.respostas || null,
        consentimento_lgpd: lead.consentimento_lgpd === true,
        politica_versao: lead.politica_versao || null
      })
    }).then(function (r) {
      if (!r.ok) return { ok: false, remote: false };
      return { ok: true, remote: true, id: lead.id };
    }).catch(function () { return { ok: false, remote: false }; });
  }
};
