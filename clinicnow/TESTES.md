# ClinicNow — Relatório de Testes Automatizados

Exigência do Founder (Fase 2): *"O modelo precisa rodar no mínimo viável, testado, ANTES da primeira venda."*
Suite end-to-end com **Playwright (Chromium)** cobrindo os fluxos críticos e as regressões dos vetos do Conselho.

**Última execução: 2026-07-28 — 29 testes, 29 verdes (0 falhas).**

Cobre também as duas decisões do Founder de 2026-07-28: **ICP ampliado** (profissionais da saúde e donos de clínica, não só médicos) e **assinatura anual** (R$ 970 / R$ 2.970 / R$ 9.970 por ano).

## Como rodar

```bash
cd clinicnow/tests
npm install          # instala @playwright/test 1.56.1 (uma vez)
npm test             # roda a suíte inteira
```

Notas do ambiente:
- O Chromium já está instalado em `/opt/pw-browsers/chromium` — **não** rode `playwright install`. O `playwright.config.js` aponta `executablePath` direto para esse binário.
- O config sobe automaticamente `python3 -m http.server 8199` na raiz do repositório (via `webServer`) e navega em `http://127.0.0.1:8199/clinicnow/`. Não é preciso subir servidor manualmente.
- Todos os testes são herméticos: fontes externas são abortadas e as chamadas ao Supabase (`/rest/v1/clinicnow_leads`) são interceptadas/mockadas — nenhum teste depende de rede ou grava no banco real.

## Testes e resultados

### `captura.spec.js` — página de captura de leads

| # | Teste | O que cobre | Resultado |
|---|-------|-------------|-----------|
| 1 | Validação: sem nome/WhatsApp/e-mail mostra erro | Formulário não envia incompleto; erro visível; nenhuma chamada de rede | VERDE |
| 2 | E-mail obrigatório | Nome+WhatsApp sem e-mail bloqueia o envio (a sequência de e-mails do beta depende do e-mail); nenhuma chamada de rede | VERDE |
| 3 | Honeypot anti-spam | Campo invisível preenchido (comportamento de bot) → descarte silencioso: tela de sucesso exibida, mas **zero** chamadas de rede e nada no backup local | VERDE |
| 4 | **Contrato do payload** | Intercepta o POST real e asserta o **body**: `id` (UUID gerado no cliente), `nome`, `whatsapp`, `email`, `consentimento_lgpd: true`, `politica_versao: "1.0-2026-07"`, `origem`, header `Prefer: return=minimal`; e o MESMO id no backup local. É o teste que teria pego o defeito "consentimento nunca chega ao banco" | VERDE |
| 5 | LGPD: checkbox obrigatório | Link para `privacidade.html` presente; desmarcado bloqueia o envio com mensagem específica; nenhuma chamada de rede | VERDE |
| 6 | Sucesso: insert remoto confirmado (mock HTTP 201) | Só mostra "Cadastro recebido!" quando o banco confirma | VERDE |
| 7 | Falha de rede (request abortado) | Mostra "Não conseguimos registrar agora" + botão de WhatsApp; backup preservado no `localStorage`; "Tentar novamente" reabilita o formulário; **nunca** mostra tela de sucesso | VERDE |
| 8 | Falha HTTP 500 | Status não-2xx também é tratado como falha honesta (não basta o fetch não lançar) | VERDE |

### `app.spec.js` — cockpit (app.html)

| # | Teste | O que cobre | Resultado |
|---|-------|-------------|-----------|
| 9 | Cadastro exige consentimento LGPD | Sem o checkbox, não cria conta, não mostra o shell e não dispara nenhuma chamada ao banco | VERDE |
| 10 | **Contrato do payload do cadastro-app** | Intercepta o POST do signup e asserta `origem: "cadastro-app"`, `consentimento_lgpd: true`, `politica_versao: "1.0-2026-07"` no body | VERDE |
| 11 | Diagnóstico de 7 perguntas → plano gerado | Cadastro, aba Diagnóstico, 7 respostas, plano de 4 semanas renderizado (Semana 1 a Semana 4); o conteúdo gerado **não** contém "resultado prometido" e contém "resultado medido e acompanhado" | VERDE |
| 12 | **ICP ampliado: nicho novo gera plano real** | Diagnóstico com nicho "Fisioterapia" (novo) executa o motor real e renderiza "Protocolos sugeridos para Fisioterapia" com o protocolo "Ciclo de Reabilitação"; conteúdo gerado sem vocabulário de desfecho clínico (veto vale para todos os conselhos, não só CFM) | VERDE |
| 13 | CRM: adicionar lead e mudar de etapa | Lead entra na coluna "Novo", botão ▶ move para "Conversando", coluna origem esvazia | VERDE |
| 14 | Checklist persiste após reload | Ação marcada no plano continua marcada após `reload`; painel mostra "1 de N ações concluídas" | VERDE |

### `regressao.spec.js` — grep estático nos artefatos

Escopo do grep: **apenas `.html` e `.js` no topo de `clinicnow/`** (arquivos servidos ao usuário). Docs internos (`TESTES.md`, `juridico/`, `campanha/`) podem citar as frases vetadas para documentá-las e ficam fora do escopo por design.

| # | Teste | O que cobre | Resultado |
|---|-------|-------------|-----------|
| 15 | "resultado prometido" banido | Nenhum `.html`/`.js` servido ao usuário contém a expressão vetada (CFM) | VERDE |
| 16 | Escassez fabricada banida | `index.html` e `captura.html` sem "20 primeiras", "primeiras 20", "vagas limitadas", "Aplicar para uma vaga" | VERDE |
| 17 | Features futuras marcadas "em breve" | Bullets de planos pagos que ainda não existem no app têm `class="soon"` + selo `em breve` visualmente distinto | VERDE |
| 18 | Consentimento LGPD no HTML | `captura.html` contém o checkbox `id="lgpd"` e o link `href="privacidade.html"` | VERDE |
| 19 | Vocabulário de desfecho clínico banido de `app.html` | "sair da dor", "resultado estético", "reduzir ansiedade", "resultado prometido" e o campo `promessa:` não existem no código (campo renomeado para `proposta`) | VERDE |
| 20 | "exemplo ilustrativo" no mock do hero | `index.html` declara a natureza ilustrativa junto ao número da projeção | VERDE |
| 21 | FAQ sem absoluto | "Tudo que o ClinicNow recomenda" removido do FAQ CFM | VERDE |
| 22 | E-mail obrigatório + honeypot no HTML | `captura.html` tem `id="email"` com `required` e o campo honeypot `id="hp-site"` | VERDE |
| 23 | Versão única da política | `"1.0-2026-07"` definida em `config.js` (`CLINICNOW.politicaVersao`), exibida em `privacidade.html`; captura e app usam a fonte única, sem versão divergente hardcoded | VERDE |
| 24 | **ICP ampliado no index** | `index.html` contém "profissionais da saúde" e "COFFITO" (FAQ generalizada para os conselhos); headline/eyebrow restritos a médicos ("máquina de crescimento para médicos", "Para médicos e clínicas que querem crescer") não podem renascer | VERDE |
| 25 | **ICP ampliado na captura** | Select de especialidade contém os 6 novos nichos: Fisioterapia, Nutrição, Odontologia, Enfermagem / Clínica de enfermagem, Estética avançada / Biomedicina, Clínica multiprofissional (dono/gestor) | VERDE |
| 26 | **ICP ampliado no app** | `PROTOCOLOS` tem entrada para cada novo nicho, todas com campo `proposta:` (nunca `promessa:`); guarda-corpo cita COFFITO (regra generalizada para todos os conselhos) | VERDE |
| 27 | **Preços anuais no index** | Os 3 valores anuais (`R$ 970/ano`, `R$ 2.970/ano`, `R$ 9.970/ano`) presentes; 3 linhas "equivale a R$ X/mês" como apoio; nota "Preço de lançamento … não afetam assinaturas ativas"; os preços mensais antigos (`R$ 97/mês`, `R$ 297/mês`, `R$ 997/mês`) não podem renascer | VERDE |
| 28 | **Termos em ciclo anual** | `termos-beta.html` contém "assinatura anual" e "Cobrança anual antecipada" (e não contém mais "assinatura mensal"/"Cobrança mensal"); reajuste só na renovação com "pelo menos 30 dias de antecedência"; vigentes "mantêm o preço contratado até a renovação seguinte"; arrependimento CDC "art. 49" mantido | VERDE |
| 29 | Termos publicados e linkados | `termos-beta.html` existe e está linkado nos footers de `index.html` e `privacidade.html`, junto da Privacidade | VERDE |

## Evidência

```
Running 29 tests using 1 worker
  29 passed (7.4s)
```

## O que ainda NÃO está coberto (dívida de teste declarada)

- **DIVERGÊNCIA DE OFERTA (L5):** `investidores.html` ainda exibe os preços mensais antigos (R$ 97/297/997) e ICP só-médicos — fora do escopo da decisão do Founder nesta rodada; pendente de decisão do Conselho. A `campanha/` foi atualizada para o anual pelo Marketing na mesma rodada (working tree, com os mesmos equivalentes mensais R$ 81/248/831 — coerente com a landing); o grep de preços (teste 27) cobre só `index.html` por enquanto — ampliar o escopo para a campanha quando ela for integrada, conforme L3/L5.
- `investidores.html` (documento interno para investidores) não passa pelo grep de escassez — ainda menciona "vagas limitadas"; decisão pendente do Conselho sobre escopo.
- Import de leads da captura para o CRM (`⤵ Importar N da página de captura`) não tem teste dedicado.
- A fila local de backup não é reenviada automaticamente ao banco quando a conexão volta (comportamento ainda não existe — ver BACKLOG).
- Nenhum teste roda contra o Supabase real (por design: testes herméticos). O smoke test da seção abaixo cobriu o esquema/RLS uma vez; não é contínuo.
- O honeypot é anti-bot-simples: bot que executa JS e não preenche campos ocultos passa. Custo zero, proteção proporcional ao estágio.

## Smoke test contra o banco REAL (rodada de 2026-07-28, pós-integração) — registro honesto

O que de fato foi verificado, com as limitações declaradas:

| # | Verificação | O que foi feito de verdade | Resultado |
|---|-------------|----------------------------|-----------|
| 13a | Escopo do grep CFM | Corrigido para só arquivos servidos ao usuário (`.html`/`.js`); docs internos podem citar a frase vetada para documentá-la | VERDE |
| 14a | Esquema real de `clinicnow_leads` | Colunas conferidas via API de administração. **Bug pego**: o form enviava `consentimento_lgpd`, coluna que não existia → todo cadastro real falharia com 400 | CORRIGIDO |
| 15a | Migração `clinicnow_leads_consentimento_lgpd` | Colunas `consentimento_lgpd` (boolean) e `politica_versao` (text) criadas — registro de consentimento exigido pela LGPD art. 8º §2º | APLICADA |
| 16a | Insert sob papel `anon` (RLS real), transação com rollback | **Ressalva importante**: o payload foi **montado à mão** para reproduzir o que o app enviaria, não capturado do app real. Naquele momento o `config.js` **não** incluía `consentimento_lgpd`/`politica_versao` no body — ou seja, o smoke test validou o banco, mas **não** o contrato app→banco, e por isso não pegou o defeito. 1 linha inserida e revertida | VERDE, COM RESSALVA |

**Lição registrada (pós-mortem):** smoke test com payload montado à mão valida o destino, não o remetente. A lacuna foi fechada pelos testes de contrato #4 e #10, que interceptam o POST **do próprio app** e assertam o body — esses rodam em toda execução da suíte.

RLS confirmada na rodada: INSERT liberado para `anon` (política "captura publica insere"), SELECT só `authenticated`.

**Verificado contra o banco real (smoke test L1, orquestrador):** a suspeita acima se confirmou PIOR do que o previsto — com `return=representation`, o `INSERT ... RETURNING` viola a RLS (42501, anon não tem SELECT) e o request inteiro falha: todo cadastro real cairia no fluxo de falha honesta. Correção aplicada: **UUID gerado no cliente + `Prefer: return=minimal`** — o id vai no body, a correlação lead→plano→e-mail fica garantida e a tabela continua ilegível para anônimos. Insert com o payload exato do código (id, consentimento, versão da política) executado sob papel `anon` no banco real, em transação com rollback: **aceito**. Nenhuma política RLS foi afrouxada.
