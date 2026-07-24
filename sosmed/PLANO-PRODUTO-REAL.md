# SosMed · Plano de Produto Real (do protótipo à venda)

**Criado em 24/07/2026.** Infraestrutura já provisionada hoje: Supabase `sosmed` (região São Paulo, projeto `yaqphldowpshhrtvvfaq`) com 10 tabelas, RLS completo e trigger de cadastro; marketplace já lê/grava no banco real. Time Vercel: `sosmedai`.

## Arquitetura-alvo

```
Navegador (páginas atuais) ──► Supabase (auth + Postgres/RLS + storage)
        │                            ▲
        ▼                            │
Vercel (hospedagem + funções serverless: /api/lia, /api/webhooks)
        │
        ├─► Anthropic API (Lia com IA real + copiloto)
        ├─► WhatsApp Business API (Meta)
        └─► Gateway Pix/cartão (Mercado Pago ou Asaas)
```

## Backlog de backend (épicos em ordem de execução)

### Sprint 1 — Contas e dados reais (destrava tudo)
- [x] Projeto Supabase + schema (profissionais, pacientes, consultas, lia_conversas, documentos, exames, lembretes, marketplace_perfis, marketplace_agendamentos, avaliacoes) + RLS + trigger de signup *(feito hoje)*
- [x] Marketplace lendo/gravando no banco (perfis públicos, agendamentos, avaliações em moderação) *(feito hoje)*
- [ ] Tela de login/cadastro no `app.html` (Supabase Auth, e-mail+senha; magic link depois)
- [ ] Camada de dados do console: trocar `localStorage` por chamadas ao Supabase (manter cache local p/ offline); migrador "importar meus dados do navegador"
- [ ] Console publica perfil direto na tabela `marketplace_perfis` (hoje publica no localStorage)
- [ ] Agendamentos do marketplace aparecem na Agenda do console (query `marketplace_agendamentos` → aceitar → vira `consultas`)
- [ ] Storage do Supabase para fotos de perfil (hoje é dataURL no banco local)

### Sprint 2 — Lia com IA real (o diferencial vendável)
- [ ] Função serverless no Vercel `/api/lia`: recebe conversa → chama Anthropic API (claude-sonnet-5) com system prompt de vendas + guarda-corpos (nunca orientação clínica, transferir sintomas, sem promessas) → resposta
- [ ] Mesma função para o Copiloto (`/api/copiloto`): transcrição → perguntas/alertas/hipóteses com aviso "apoio, não diagnóstico"
- [ ] SOAP real (`/api/soap`): transcrição → rascunho estruturado
- [ ] Log auditável de toda resposta de IA (tabela `ia_logs`), custo por conversa monitorado
- Requisito: chave `ANTHROPIC_API_KEY` como variável de ambiente no Vercel (nunca no frontend)

### Sprint 3 — Dinheiro de verdade
- [ ] Assinatura SosMed (R$ 349/mês fundador): Stripe Billing ou Mercado Pago Assinaturas; webhook → tabela `assinaturas`; bloqueio suave ao inadimplir
- [ ] Sinal de consulta via Pix (Mercado Pago/Asaas): link de pagamento gerado no agendamento; webhook confirma → status `pago`
- [ ] Contador de vagas fundador lendo de `assinaturas` (escassez real automática)

### Sprint 4 — WhatsApp oficial
- [ ] Conta Meta Business verificada + número dedicado + templates aprovados (burocracia: iniciar já, roda em paralelo)
- [ ] Webhook `/api/whatsapp` no Vercel: mensagem recebida → `/api/lia` → resposta; conversa espelhada em `lia_conversas`
- [ ] Lembretes reais (confirmação 24h antes, reativação) via templates

### Sprint 5 — Teleconsulta e prontuário forte
- [ ] Vídeo real (Daily.co ou LiveKit — SDK pronto, criptografado)
- [ ] Prontuário: criptografia de campo, trilha de auditoria (tabela `acessos`), exportação; avaliar assinatura ICP-Brasil e caminho SBIS para clínicas maiores

## Requisitos que só VOCÊ pode providenciar (comece já — são os gargalos de calendário)
1. **CNPJ da SosMed Solutions** ativo com CNAE de software/saúde (necessário p/ Meta, gateway e contratos)
2. **Conta Meta Business** verificada (WhatsApp API) — 1-3 semanas
3. **Conta no gateway** (Mercado Pago/Asaas/Stripe) com CNPJ
4. **Chave da Anthropic API** (console.anthropic.com) com billing
5. **Domínio** (sosmed.health / sosmed.com.br) — apontar para o Vercel
6. **Contrato + Termos de Uso + Política de Privacidade revisados por advogado** (direito médico/consumidor) — a garantia incondicional e o grandfathering precisam estar no papel
7. **3-5 profissionais beta** usando semanalmente (seu círculo da FACENE/contatos)

## Modelo de monetização (hipóteses a validar no beta)
- **Plano Fundador**: R$ 349/mês, preço travado em contrato, 100 vagas → meta: 30 pagantes = R$ 10,5k MRR
- **Pós-fundador**: R$ 497/mês (Pro) · R$ 897 (Clínica, multi-profissional)
- **Take rate do marketplace** (fase posterior): % sobre agendamentos de novos pacientes
- Custo variável estimado/cliente: IA ~R$ 10-30/mês + WhatsApp ~R$ 20-60/mês → margem bruta >80%

## Deploy no Vercel (3 cliques, quando quiser)
vercel.com → Add New Project → Import do GitHub `drsostenescosta-rgb.github.io` (ou repo dedicado `sosmed`) → deploy. As funções serverless dos Sprints 2-4 entram nesse projeto. *(O site já está público via GitHub Pages; o Vercel torna-se obrigatório a partir do Sprint 2, quando nascem as funções `/api/*`.)*
