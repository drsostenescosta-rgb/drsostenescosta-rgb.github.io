# SPEC — Integração MedEasy ↔ ClinicNow

**Status:** SPEC (nenhuma linha de código escrita — regra founder-100x: spec antes de código)
**Autor:** Célula de Engenharia · **Data:** 2026-07-29
**Fiscalização:** Conselho de 3 CEOs
**Fontes lidas (evidência):** `/home/user/drsostenescosta-rgb.github.io/medeasy.html`, `/home/user/drsostenescosta-rgb.github.io/sistema.html` (código completo do store, Índice de Saúde, export/portal), `/home/user/drsostenescosta-rgb.github.io/paciente.html`, `/home/user/drsostenescosta-rgb.github.io/sosmed/ESPECIFICACAO-BACKEND.md`, `/home/user/drsostenescosta-rgb.github.io/clinicnow/{app.html,config.js,index.html,investidores.html,privacidade.html,TESTES.md,tests/}`.

---

## 1 · O que é o MedEasy hoje (diagnóstico honesto)

**O que existe e funciona.** O MedEasy é dois arquivos: `medeasy.html` (landing de venda) e `sistema.html` (o produto, ~226 KB, SPA em JavaScript puro, zero dependências). O sistema é real e completo como software local: store em `localStorage` sob a chave `scp_clinic_v1` com 20+ coleções (`pacientes`, `consultas`, `receitas`, `exames`, `avaliacoes`, `agenda`, `produtos`, `vendas`, `financeiro` etc.), transcrição via Web Speech API (Chrome), geração/impressão de documentos (receita, laudo, atestado, encaminhamento, pedido de exames) com assinatura desenhada na tela e carimbo virtual, trava de acesso local com hash de senha, limite Free de 8 pacientes ativos com licença Pro validada offline (`MEDEASY-PRO-####-XXXX` com checksum), export/import de backup JSON completo e um "App do Paciente" que serializa os dados do paciente em base64 dentro de um link para `paciente.html` (funciona offline, nada trafega por servidor).

**O ativo central: o Índice de Saúde é código real, não marketing.** `computeScore(avaliacao)` (sistema.html, linhas 688–755) combina três subíndices 0–100 — Clínico (IMC 30%, pressão 25%, exames fora da referência 25%, comorbidades 20%), Hábitos (atividade, sono, alimentação, hidratação, tabagismo, álcool) e Mental (humor, ansiedade, estresse, energia, qualidade do sono) — em `geral = clínico×0.4 + hábitos×0.3 + mental×0.3`, com nota `gradeOf` (A≥90 … F<50) e `riskAlerts` automáticos. O sistema já calcula inclusive **melhora média por linha de cuidado** (primeira vs. última avaliação). É exatamente a "prova de venda ética" que a tese do ClinicNow menciona — e ela já existe, computável, no navegador.

**O que é página, não produto.** Não há backend: nenhuma chamada ao Supabase em `sistema.html` — 100% local, um dispositivo, um navegador (perder o localStorage = perder tudo, mitigado só pelo backup manual). Os planos "Profissional" e "Clínica/Hospital" são "sob consulta" via WhatsApp — não há checkout, multiusuário nem nuvem. Existe uma **segunda cópia divergente** em `sosmed/medeasy.html` (237 KB, geração anterior) ligada ao ecossistema SosMed, que tem backend Supabase real provisionado (projeto `yaqphldowpshhrtvvfaq`, 15 tabelas com RLS, endpoints Vercel) — mas essa cópia é legado e **fica fora desta spec** (risco de manutenção dupla registrado em §6). Maturidade: **produto local maduro para 1 profissional; camada comercial e nuvem são promessas.**

## 2 · Tese da integração

O ClinicNow vende crescimento comercial (diagnóstico → plano → CRM → execução); o MedEasy produz desfecho clínico medido (Índice de Saúde). Separados, o ClinicNow é mais um "sistema de marketing para clínicas" e o MedEasy é mais um prontuário. Juntos, formam o fosso descrito em `investidores.html`: **"software + dados clínicos na mesma casa"** — o único CRM cujo argumento de venda é resultado clínico medido do próprio profissional, nunca prometido. Concretamente: o roteiro de conversão do ClinicNow ("diagnóstico → plano → oferta") ganha o número que fecha a venda com ética ("meus pacientes acompanhados melhoraram em média X pontos no Índice de Saúde"), e cada lead fechado no ClinicNow vira paciente avaliado no MedEasy — o ciclo se retroalimenta. Isso também destrava honestidade pendente: o plano Pro promete "Integração com MedEasy" com selo "em breve" (`index.html:360`) e a seção "O que você recebe" promete **sem selo** (`index.html:277`) — hoje a "integração" é um hyperlink. Esta spec transforma a promessa em recurso entregue ou a rebaixa a texto honesto.

Fato arquitetural que torna a v1 trivial e segura: **os dois apps são servidos da mesma origem** (`drsostenescosta-rgb.github.io`), logo compartilham `localStorage`. A ponte v1 não precisa de backend, contas ou rede — e o dado clínico continua não saindo do dispositivo, coerente com a promessa pública de ambos os produtos.

## 3 · Integração v1 — "Ponte Local" (implementável agora)

### 3.1 Princípios de desenho
1. **Mesmo dispositivo, mesma origem, zero rede.** Nenhum dado da ponte toca o Supabase (`clinicnow_leads` continua recebendo apenas o que já recebe). Teste automatizado garante isso (§5, T7).
2. **Agregado por padrão, individual por opt-in.** O caso de uso de venda precisa primeiro do agregado anônimo ("melhora média"); dados por paciente só com segundo consentimento explícito do profissional.
3. **Somente leitura cruzada.** ClinicNow **lê** a ponte; nunca escreve dado clínico. MedEasy **lê** o prefill de lead; nunca lê o funil inteiro.
4. **Reversível.** Desligar o toggle apaga a chave da ponte; sem chave, o ClinicNow volta ao estado atual.

### 3.2 Modelo de dados (chaves exatas de `localStorage`)

**Chave A — escrita pelo MedEasy, lida pelo ClinicNow:** `medeasy_bridge_v1`
```json
{
  "v": 1,
  "updatedAt": "2026-07-29T14:00:00.000Z",
  "nivel": "agregado" | "detalhado",
  "aggregate": {
    "nPacientesAtivos": 12,
    "nAvaliados": 9,
    "indiceMedio": 71,
    "notaMedia": "C",
    "distribuicao": {"A":1,"B":2,"C":3,"D":2,"E":1,"F":0},
    "nComDuasAvaliacoes": 5,
    "melhoraMedia": 8.4
  },
  "pacientes": [
    { "id":"m9k2...", "nome":"Maria Lima", "telefoneNorm":"84988880000",
      "scoreGeral":72, "grade":"C", "dataAvaliacao":"2026-07-20",
      "nAvaliacoes":3, "delta":11 }
  ]
}
```
- `pacientes` **só existe** quando `nivel === "detalhado"`; no nível "agregado" o campo é omitido.
- `telefoneNorm` = somente dígitos, sem prefixo 55, para casar com `lead.whatsapp` do ClinicNow (match pelos últimos 8 dígitos — regra única, definida aqui, usada dos dois lados).
- `melhoraMedia` = média de (última − primeira `computeScore().geral`) dos pacientes com ≥2 avaliações; `null` quando `nComDuasAvaliacoes === 0`.
- Escrita: recomputada dentro de `persist()` do sistema.html quando o toggle está ligado (custo O(n) pequeno; n≤ centenas). Toggle desligado ⇒ `localStorage.removeItem('medeasy_bridge_v1')`.

**Chave B — escrita pelo ClinicNow, consumida (e apagada) pelo MedEasy:** `medeasy_prefill_v1`
```json
{ "v":1, "nome":"Maria Lima", "telefone":"(84) 98888-0000", "email":"",
  "origem":"clinicnow", "leadId":"id3f9a2c1", "criadoEm":"2026-07-29T14:05:00.000Z" }
```

**Estado do consentimento (dentro do store existente do MedEasy, `scp_clinic_v1`):**
`DB.ecossistema = { clinicnowBridge: 'off' | 'agregado' | 'detalhado' }` — default `'off'`. Nada muda para quem nunca tocar no recurso.

### 3.3 Fluxos de tela (exatos)

**F1 · MedEasy → ligar a ponte.** Painel do `sistema.html` ganha card "Ecossistema · ClinicNow" com seletor de 3 estados (Desligado / Compartilhar agregado / Compartilhar por paciente) e microcopy fixa: *"Os dados ficam neste navegador. Nada é enviado a servidores. O ClinicNow (aberto neste mesmo dispositivo) poderá ler: [descrição do nível]."* Mudar o estado grava `DB.ecossistema`, chama `persist()` (que escreve/remove a chave A) e mostra toast.

**F2 · ClinicNow Painel → prova de valor.** Em `PAGES.painel` (app.html), o card estático atual "🧠 Ecossistema" (linha ~265) é substituído por lógica: **sem** chave A ⇒ card "Conecte o MedEasy — abra o MedEasy neste navegador e ligue a ponte" com link `../sistema.html`; **com** chave A ⇒ card "Prova de valor clínico (MedEasy)" exibindo `indiceMedio` (nota), `melhoraMedia` ("+8,4 pts — resultado medido, nunca prometido"), `nAvaliados`, e "atualizado em {updatedAt}". Wording obrigatório: sempre "resultado medido", nunca projeção.

**F3 · ClinicNow Leads → badge clínico.** Em `PAGES.leads`, se a ponte estiver em nível "detalhado", cada card de lead cujo `whatsapp` case com um `telefoneNorm` mostra badge `❤ 72 · C` (título: "Índice de Saúde no MedEasy"). Sem match ou ponte em nível agregado ⇒ nenhum badge (sem estado de erro).

**F4 · ClinicNow → MedEasy (lead fechado vira paciente).** Leads na coluna `fechado` sem match na ponte ganham botão "→ MedEasy": grava a chave B e abre `../sistema.html` em nova aba.

**F5 · MedEasy consome o prefill.** No boot do `sistema.html` (usuário já desbloqueado), se a chave B existe: modal "Criar paciente **{nome}** vindo do ClinicNow?" → [Criar] cria paciente `{nome, telefone, email}` via caminho existente (respeitando `PLAN_LIMITE`: se limite atingido, abre o modal de limite atual e **preserva** a chave B para retry) → sucesso apaga a chave B. [Agora não] apaga a chave B (decisão: prefill é descartável; o lead continua no ClinicNow).

### 3.4 Fora de escopo da v1 (explícito)
- Qualquer sincronização remota, conta unificada, Supabase para dado clínico (v2, §4).
- Alterações em `sosmed/` (inclusive `sosmed/medeasy.html` legado) e em `captura.html`.
- Índice de Saúde de paciente individual exibido em página pública ou em material de captação.
- Multi-dispositivo (a ponte é por navegador; documentado na UI).
- Mudança do selo "em breve" **antes** de a suíte de testes da integração passar (§6, R2).

### 3.5 Decisão de arquitetura e alternativas consideradas
| Alternativa | Trade-off | Veredicto |
|---|---|---|
| **Chave localStorage compartilhada (escolhida)** | Zero backend, zero rede, LGPD-mínimo, mesmo-origem já garante; limitação: mesmo navegador | **v1** — menor superfície, entrega imediata |
| Export/import de arquivo JSON entre apps | Funciona entre dispositivos, mas fricção alta e erro humano; MedEasy já tem backup JSON | Rejeitada como mecanismo primário; o backup existente já cobre o caso raro |
| `BroadcastChannel`/`postMessage` entre abas | Tempo-real, porém exige as duas abas abertas e não persiste | Rejeitada — a ponte precisa sobreviver a sessões |
| Supabase desde já (tabela compartilhada) | Viola a promessa pública "nada é enviado a servidores" dos dois produtos e exige DPA (privacidade §5.3) antes | Adiada para v2 com gate |

Risco arquitetural assumido: se o ClinicNow migrar para domínio próprio (plano declarado em investidores.html), a mesma-origem quebra e a v1 morre — por isso a v1 é deliberadamente pequena e a v2 (contas) é o caminho definitivo. Registrado como dívida consciente.

## 4 · Integração v2 — contas na nuvem (pós-gate, Lei do Composto)

**Gate de entrada (nenhuma linha antes disso):** (a) v1 em uso real por ≥3 profissionais beta; (b) DPA modelo publicado (a política v1.1 §5.3 já promete "DPA antes de qualquer sincronização de dados de pacientes"); (c) decisão do Founder sobre domínio/identidade do ecossistema.

**Arquitetura:** reutilizar o projeto Supabase existente (`yaqphldowpshhrtvvfaq`, sa-east-1), que já tem `profissionais` (1:1 `auth.users`, trigger de signup), `pacientes`, `consultas`, RLS testada e endpoints Vercel. Uma conta (`auth.users`) = um profissional em todo o ecossistema (SosMed, MedEasy, ClinicNow).

**Esquema proposto (migração `medeasy_clinicnow_v2`):**
```sql
-- Avaliações do Índice de Saúde (fonte: MedEasy)
create table medeasy_avaliacoes (
  id uuid primary key default gen_random_uuid(),
  profissional_id uuid not null references profissionais(id),
  paciente_id uuid not null references pacientes(id),
  score_geral int2 not null check (score_geral between 0 and 100),
  score_clinico int2, score_mental int2, score_habitos int2,
  nota char(1) not null check (nota in ('A','B','C','D','E','F')),
  payload jsonb,            -- respostas brutas; candidata a cifra client-side
  avaliado_em date not null,
  criado_em timestamptz not null default now(),
  origem_local_id text      -- id do registro no localStorage p/ sync idempotente
);
-- Vínculo lead (ClinicNow) ↔ paciente (clínico)
create table clinicnow_lead_paciente (
  lead_id uuid primary key,
  paciente_id uuid not null references pacientes(id),
  profissional_id uuid not null references profissionais(id),
  criado_em timestamptz not null default now()
);
-- RLS idêntica ao padrão já testado do projeto:
alter table medeasy_avaliacoes enable row level security;
create policy p_sel on medeasy_avaliacoes for select using (auth.uid() = profissional_id);
create policy p_ins on medeasy_avaliacoes for insert with check (auth.uid() = profissional_id);
-- (idem update/delete; mesma quadra de policies em clinicnow_lead_paciente)
```

**Sincronização local-first:** outbox no cliente (fila de mutações com `origem_local_id`), upsert idempotente, last-write-wins por `updatedAt` de registro; localStorage continua sendo o cache de leitura (padrão já usado pelo SosMed em `console_estado`, cuja migração para tabelas normalizadas está no backlog deles — convergir, não duplicar). **Planejado para modelos 10x:** o valor da v2 não é o CRUD — é que, com o dado clínico estruturado e consentido no Postgres, um modelo 2 anos mais barato gera automaticamente relatório de desfecho por linha de cuidado, texto de prova social conforme CFM 2.336/2023 e priorização de recall; o esquema acima (payload jsonb + scores colunares) foi desenhado para esse consumo por LLM sem nova migração. Criptografia client-side do `payload` fica como decisão aberta (trade-off: privacidade máxima vs. impossibilidade de recuperação de senha e de análise server-side) — decidir no gate, com parecer de Segurança.

## 5 · Critérios de sucesso testáveis (Definition of Done — Playwright)

Suíte nova `clinicnow/tests/integracao.spec.js`, hermética como as existentes (Supabase mockado, fontes externas abortadas, servidor `http.server 8199` na raiz do repo — já serve `/sistema.html` e `/clinicnow/`).

| # | Teste | Passa quando |
|---|---|---|
| T1 | Ponte agregada | Seed de `scp_clinic_v1` com 3 pacientes/avaliações conhecidas + toggle "agregado" ⇒ `medeasy_bridge_v1` existe, `indiceMedio` e `distribuicao` batem com valores pré-calculados pela mesma fórmula de `computeScore` |
| T2 | Nível agregado não vaza indivíduo | No nível "agregado", `JSON.parse(bridge).pacientes === undefined` |
| T3 | Card no Painel ClinicNow | Com ponte ⇒ card mostra índice médio e melhora média; sem ponte ⇒ card "Conecte o MedEasy" com link para `../sistema.html` |
| T4 | Badge no lead | Nível "detalhado" + lead com whatsapp casando (últimos 8 dígitos) ⇒ badge `❤ {score} · {nota}` visível; lead sem match ⇒ sem badge |
| T5 | Lead fechado → MedEasy | Botão grava `medeasy_prefill_v1` com nome/telefone/leadId corretos |
| T6 | Prefill vira paciente | Abrir `sistema.html` com prefill ⇒ modal; confirmar ⇒ `DB.pacientes.length` +1 com nome/telefone corretos e chave B removida |
| T7 | **Zero rede clínica** | Interceptação de todas as requests durante T1–T6: nenhuma request contém `score`, `nota`, `avaliac` ou nome de paciente; nenhuma request extra a `/rest/v1/` além das já existentes |
| T8 | Reversibilidade | Toggle → off ⇒ chave A removida e Painel ClinicNow volta ao card "Conecte" |
| T9 | Limite Free respeitado | 8 pacientes ativos + prefill ⇒ modal de limite, nenhum paciente criado, chave B preservada |
| T10 | Regressão | Os 29 testes existentes (`app.spec.js`, `captura.spec.js`, `regressao.spec.js`) continuam verdes |

DoD adicional não-Playwright: política de privacidade atualizada (§6-R1) publicada **no mesmo commit** que a feature; selo do plano Pro só muda conforme R2.

## 6 · Riscos e o que a política precisa ganhar

**R1 · LGPD — dado de paciente atravessando produtos (risco alto, mitigado por desenho).** Dado de saúde é sensível (art. 5º, II). Mitigações estruturais da v1: tudo no dispositivo, agregado por padrão, opt-in em dois níveis, reversível, zero rede (T7 prova). Papéis já corretos na política v1.1: profissional = controlador dos dados de pacientes; ClinicNow = operador (§5). **A política v1.1 precisa ganhar (→ v1.2):** (i) item na §5 descrevendo a "integração local com o MedEasy": o que é lido, que fica no navegador do profissional, que nunca é enviado aos nossos servidores, e que o nível "por paciente" exige ação explícita do profissional; (ii) espelho do mesmo texto no disclaimer do `sistema.html`; (iii) reafirmar que a sincronização remota (v2) só ocorrerá após DPA — que a política já promete (§5.3). Obrigação do controlador a exibir na UI do toggle: o profissional responde por ter base legal para o registro clínico que ele próprio compartilha consigo mesmo entre ferramentas.

**R2 · Promessa do plano Pro (risco de integridade comercial).** Hoje há **inconsistência**: `clinicnow/index.html:360` diz "Integração com MedEasy — em breve", mas a linha 277 ("O que você recebe") promete a integração **sem selo**. Correção em duas fases: (fase A, imediata e independente desta feature) linha 277 ganha o selo "em breve" — promessa não entregue não fica sem selo nem por um dia; (fase B) após T1–T10 verdes + política v1.2 publicada, ambos os textos mudam para o entregue real e honesto: **"Integração local com o MedEasy (Índice de Saúde no painel e no funil, no mesmo dispositivo)"** — sem sugerir nuvem/multi-dispositivo que não existem.

**R3 · Conselhos profissionais (CFM 2.336/2023 e congêneres).** O Índice no contexto de venda não pode virar promessa de resultado. Regras codificadas na UI (não em doc): card do painel sempre com "resultado medido, nunca prometido"; agregado exibido apenas ao próprio profissional logado (nunca em página pública ou captura — fora de escopo §3.4); badge individual é ferramenta interna de gestão do funil, e a política/termos orientam que divulgação externa de resultados segue as normas do conselho com autorização por escrito do paciente (texto que o `app.html` já usa no plano de crescimento).

**Riscos técnicos/dívidas registradas:** (D1) dependência de mesma-origem — quebra com domínio próprio; aceita conscientemente, v2 é a saída. (D2) `sistema.html` é monólito de 226 KB sem testes próprios — a suíte T1/T6/T9 passa a ser a primeira rede de proteção dele; dívida de modularização permanece. (D3) cópia legado `sosmed/medeasy.html` diverge e pode confundir usuários e agentes — recomendação (fora desta spec): decisão do Founder de arquivar ou redirecionar. (D4) match por telefone é heurística (últimos 8 dígitos) — colisões possíveis em tese; aceitável para funil de dezenas de leads, resolvido de vez pelo vínculo formal na v2 (`clinicnow_lead_paciente`).

## 7 · Estimativa de implementação v1

| Item | Arquivos tocados | h-agente |
|---|---|---|
| Ponte no MedEasy (toggle, writer em `persist()`, consumo do prefill, modal) | `sistema.html` | 2,0 |
| Card do painel + badge no funil + botão "→ MedEasy" | `clinicnow/app.html` | 1,5 |
| Selo "em breve" na linha 277 (fase A do R2) | `clinicnow/index.html` | 0,2 |
| Política v1.2 (§5 + disclaimer espelho) | `clinicnow/privacidade.html`, `sistema.html` | 0,8 |
| Suíte `integracao.spec.js` (T1–T9) + rodar regressão (T10) + `TESTES.md` | `clinicnow/tests/…`, `clinicnow/TESTES.md` | 2,5 |
| Revisão de segurança + ajustes de iteração até verde | — | 1,0 |
| **Total** | **6 arquivos** | **~8 h-agente (1 sessão)** |

A fase B do R2 (trocar "em breve" por texto de entregue) é um commit separado, condicionado ao DoD completo.

---

## Auto-avaliação (onde esta spec está mais fraca)

1. **Nada foi executado** — a leitura foi estática. O maior risco é o comportamento do boot do `sistema.html` com o auth-gate local (F5: o modal de prefill precisa esperar o desbloqueio; a spec define a regra, mas a ordem exata dos eventos do gate só será confirmada na implementação).
2. **Match por telefone** é a parte mais frágil do desenho (D4) — deliberadamente aceita, mas é onde a v1 pode gerar badge errado.
3. **Esquema v2** foi proposto sem inspecionar colunas reais das tabelas `pacientes`/`profissionais` do Supabase (li a especificação, não o dump) — os `references` podem precisar de ajuste ao aplicar a migração.
4. A estimativa assume que os seeds de `scp_clinic_v1` via `page.addInitScript` funcionam como nos testes existentes do `clinicnow_db`; se o `sistema.html` exigir interação com o auth-gate nos testes, T1/T6/T9 custam +1h.
