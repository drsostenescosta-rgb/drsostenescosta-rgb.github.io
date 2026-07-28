# MedGroth — Relatório de Testes Automatizados

Exigência do Founder (Fase 2): *"O modelo precisa rodar no mínimo viável, testado, ANTES da primeira venda."*
Suite end-to-end com **Playwright (Chromium)** cobrindo os fluxos críticos e as regressões dos vetos do Conselho.

**Última execução: 2026-07-28 — 12 testes, 12 verdes (0 falhas).**

## Como rodar

```bash
cd medgroth/tests
npm install          # instala @playwright/test 1.56.1 (uma vez)
npm test             # roda a suíte inteira
```

Notas do ambiente:
- O Chromium já está instalado em `/opt/pw-browsers/chromium` — **não** rode `playwright install`. O `playwright.config.js` aponta `executablePath` direto para esse binário.
- O config sobe automaticamente `python3 -m http.server 8199` na raiz do repositório (via `webServer`) e navega em `http://127.0.0.1:8199/medgroth/`. Não é preciso subir servidor manualmente.
- Todos os testes são herméticos: fontes externas são abortadas e as chamadas ao Supabase (`/rest/v1/medgroth_leads`) são interceptadas/mockadas — nenhum teste depende de rede ou grava no banco real.

## Testes e resultados

### `captura.spec.js` — página de captura de leads

| # | Teste | O que cobre | Resultado |
|---|-------|-------------|-----------|
| 1 | Validação: sem nome/WhatsApp mostra erro | Formulário não envia vazio; erro visível; nenhuma chamada de rede disparada | VERDE |
| 2 | LGPD: checkbox obrigatório | Link para `privacidade.html` presente; desmarcado bloqueia o envio com mensagem específica; nenhuma chamada de rede | VERDE |
| 3 | Sucesso: insert remoto confirmado (mock HTTP 201) | Só mostra "Cadastro recebido!" quando o banco confirma | VERDE |
| 4 | Falha de rede (request abortado) | Mostra "Não conseguimos registrar agora" + botão de WhatsApp; backup preservado no `localStorage`; "Tentar novamente" reabilita o formulário; **nunca** mostra tela de sucesso | VERDE |
| 5 | Falha HTTP 500 | Status não-2xx também é tratado como falha honesta (não basta o fetch não lançar) | VERDE |

### `app.spec.js` — cockpit (app.html)

| # | Teste | O que cobre | Resultado |
|---|-------|-------------|-----------|
| 6 | Diagnóstico de 7 perguntas → plano gerado | Cadastro, aba Diagnóstico, 7 respostas, plano de 4 semanas renderizado (Semana 1 a Semana 4); o conteúdo gerado **não** contém "resultado prometido" e contém "resultado medido e acompanhado" | VERDE |
| 7 | CRM: adicionar lead e mudar de etapa | Lead entra na coluna "Novo", botão ▶ move para "Conversando", coluna origem esvazia | VERDE |
| 8 | Checklist persiste após reload | Ação marcada no plano continua marcada após `reload`; painel mostra "1 de N ações concluídas" | VERDE |

### `regressao.spec.js` — grep estático nos artefatos

| # | Teste | O que cobre | Resultado |
|---|-------|-------------|-----------|
| 9 | "resultado prometido" banido | Nenhum `.html`/`.js`/`.md` de `medgroth/` contém a expressão vetada (CFM) | VERDE |
| 10 | Escassez fabricada banida | `index.html` e `captura.html` sem "20 primeiras", "primeiras 20", "vagas limitadas", "Aplicar para uma vaga" | VERDE |
| 11 | Features futuras marcadas "em breve" | Bullets de planos pagos que ainda não existem no app têm `class="soon"` + selo `em breve` visualmente distinto | VERDE |
| 12 | Consentimento LGPD no HTML | `captura.html` contém o checkbox `id="lgpd"` e o link `href="privacidade.html"` | VERDE |

## Evidência

```
Running 12 tests using 1 worker
  12 passed (4.4s)
```

## O que ainda NÃO está coberto (dívida de teste declarada)

- `investidores.html` (documento interno para investidores) não passa pelo grep de escassez — ainda menciona "vagas limitadas"; decisão pendente do Conselho sobre escopo.
- Import de leads da captura para o CRM (`⤵ Importar N da página de captura`) não tem teste dedicado.
- A fila local de backup não é reenviada automaticamente ao banco quando a conexão volta (comportamento ainda não existe — ver BACKLOG).
- Nenhum teste roda contra o Supabase real (por design: testes herméticos). A tabela `medgroth_leads` e sua RLS precisam de verificação manual/separada antes da primeira venda.

## Smoke test contra o banco REAL (orquestrador, pós-integração)

| # | Verificação | Resultado |
|---|-------------|-----------|
| 13 | Escopo do grep CFM corrigido: só arquivos servidos ao usuário (.html/.js) — docs internos podem citar a frase vetada para documentá-la | VERDE |
| 14 | Esquema real de `medgroth_leads` conferido; **bug pego pelo smoke test**: o form enviava `consentimento_lgpd`, coluna que não existia → todo cadastro real falharia com 400 | CORRIGIDO |
| 15 | Migração `medgroth_leads_consentimento_lgpd`: colunas `consentimento_lgpd` (boolean) e `politica_versao` (text) — registro de consentimento exigido pela LGPD art. 8º §2º | APLICADA |
| 16 | Insert com o payload exato do navegador sob papel `anon` (RLS real), em transação com rollback: **1 linha inserida** | VERDE |

RLS confirmada: INSERT liberado para `anon` (política "captura publica insere"), SELECT só `authenticated`.
