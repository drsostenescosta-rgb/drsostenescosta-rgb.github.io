# Init Impecável — o padrão perpétuo de inicialização de projetos

Todo projeto novo da empresa (produto, agente, site, integração) nasce por este rito — **de maneira perpétua, baseado no founder-100x**. Um projeto que pula o init nasce com dívida; o init é barato, a dívida não.

## O rito (na ordem, sem pular)

1. **Contrato de Missão primeiro**: o Conselho define objetivo, Definition of Perfect mensurável e pre-mortem [B19] ANTES de qualquer arquivo.
2. **Espinha do repositório**: criar/atualizar os artefatos de legibilidade — `CONTEXTO-EMPRESA.md` (ou seção do projeto nela), `RADAR.md`, `DECISOES.md`, `EQUIPE.md`, `INOVACAO.md`, diretório `specs/` (toda feature nasce spec), diretório `tests/`.
3. **Spec antes de código** (inviolável): a primeira entrega de qualquer feature é a spec com critérios de sucesso testáveis.
4. **Testes desde o dia 0**: suíte executável no primeiro commit de código; toda correção de fiscalização vira regressão (L3); testes de integração usam o payload real (L1).
5. **Stack padrão da casa** (desviar exige veredito do Conselho registrado): **Supabase** (dados, RLS por padrão, service role só no servidor), **Vercel** (hosting/serverless), **Stripe** (cobrança), **Anthropic API — modelos atuais da família Claude** (conferir o modelo vigente a cada projeto; nunca fixar modelo antigo de tutorial), **Meta WhatsApp Business API** quando houver canal de conversa (ver `playbook-agente-whatsapp.md`).
6. **Segredos**: NUNCA no frontend nem no repositório; env vars no host (Vercel) conferidas antes do primeiro deploy (causa nº 1 de falha); tokens permanentes via System User onde a plataforma oferecer (proibido token temporário em produção).
7. **LGPD desde o primeiro formulário**: consentimento com timestamp + versão da política; papéis controlador/operador definidos se houver dado de terceiros.
8. **Lições são lei desde o dia 0**: L1–L10 valem para o projeto novo no primeiro commit — o projeto herda toda a memória da empresa, não começa ingênuo.
9. **Preview antes de produção**: deploy de preview para teste do Founder; produção (merge no main/domínio) é porta de mão única.
10. **Ciclo de reaprendizado do init**: ao fim do bootstrap, registrar o que o rito não cobriu — o init é vivo e melhora a cada projeto.

## Checklist de 1 minuto (cole no início de todo projeto)
```
[ ] Contrato de Missão + Definition of Perfect + pre-mortem
[ ] specs/ e tests/ criados; primeira spec escrita
[ ] RADAR/DECISOES atualizados com o projeto
[ ] Stack padrão (ou desvio aprovado pelo Conselho)
[ ] Env vars no host; zero segredo no código
[ ] LGPD no primeiro ponto de coleta
[ ] Suíte verde no primeiro commit de código
[ ] Preview para o Founder antes de qualquer produção
```
