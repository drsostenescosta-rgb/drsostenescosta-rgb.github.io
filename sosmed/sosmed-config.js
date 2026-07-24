/* SosMed · configuração do backend (Supabase)
   A chave abaixo é PUBLISHABLE (segura para o navegador): o que cada pessoa
   pode ler/gravar é controlado por Row Level Security no banco. */
window.SOSMED_BACKEND = {
  url: 'https://yaqphldowpshhrtvvfaq.supabase.co',
  key: 'sb_publishable_V64ejsDNKclPdFlqymghnQ_jUr5ivj1',
  rest: function(path){ return this.url + '/rest/v1/' + path; },
  headers: function(extra){
    var h = { 'apikey': this.key, 'Authorization': 'Bearer ' + this.key, 'Content-Type': 'application/json' };
    for (var k in (extra||{})) h[k] = extra[k];
    return h;
  }
};
