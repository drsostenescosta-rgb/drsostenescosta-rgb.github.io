# Textos de consentimento — MedGroth

> **Nota:** produto renomeado para ClinicNow em 2026-07-28. As menções a "MedGroth" abaixo são históricas.

> Gerado por IA — exige revisão de advogado humano licenciado antes de uso real.

## 1. Checkbox do formulário de captura (`captura.html`)

Inserir como checkbox **obrigatório e desmarcado por padrão** (LGPD, art. 8º, §1º — consentimento deve ser manifestação livre, informada e inequívoca; pré-marcado não é inequívoco — regra clara na lei, "desmarcado por padrão" é a leitura consolidada da ANPD/doutrina):

```html
<label class="chk-consent">
  <input type="checkbox" id="consent" required>
  <span>Autorizo o MedGroth a usar meus dados para gerar meu diagnóstico e me
  contatar por WhatsApp/e-mail sobre o produto, conforme a
  <a href="privacidade.html" target="_blank" rel="noopener">Política de Privacidade</a>.
  Posso cancelar quando quiser.</span>
</label>
```

Texto puro (1-2 linhas):

> Autorizo o MedGroth a usar meus dados para gerar meu diagnóstico e me contatar por WhatsApp/e-mail sobre o produto, conforme a [Política de Privacidade](privacidade.html). Posso cancelar quando quiser.

Notas de implementação para a Engenharia:
- O botão de envio só ativa com o checkbox marcado; gravar junto do lead o carimbo `consentimento: true` + `consentido_em` (timestamp) + versão da política (ex.: `politica_v: "1.0"`), para prova do consentimento (LGPD, art. 8º, §2º — ônus da prova é do controlador).
- A frase atual da página ("🔒 Seus dados ficam com a gente. Nada de spam…") pode permanecer como reforço, mas **não substitui** o checkbox: aviso não é consentimento.
- Estritamente, gerar o diagnóstico dispensaria consentimento (execução de contrato, art. 7º, V); o checkbox cobre o **contato comercial posterior**, que é a parte que exige consentimento. Um único checkbox combinando os dois é aceitável aqui porque o contato é parte declarada do serviço — interpretação; se quiser blindagem máxima, separar em dois checkboxes.

## 2. Linha de consentimento do cadastro pago (futuro checkout)

Checkbox obrigatório no checkout, desmarcado por padrão:

> Li e aceito os [Termos de Uso do Beta Fundador](termos-beta.html) e a [Política de Privacidade](privacidade.html), incluindo o papel do MedGroth como operador dos dados de pacientes que eu registrar no CRM.

Opcional (segundo checkbox, **não obrigatório**, para comunicações além do produto):

> (Opcional) Quero receber novidades, conteúdos e ofertas do ecossistema MedGroth/Zetheon por e-mail e WhatsApp.

Notas:
- Aceite de termos ≠ consentimento LGPD; por isso a linha obrigatória fala em "li e aceito" (contrato) e a de marketing fica separada e opcional (consentimento granular — LGPD, art. 8º, §4º: finalidades determinadas; autorizações genéricas são nulas — regra clara).
- Registrar timestamp e versão dos termos aceitos.
