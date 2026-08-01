-- ============================================================================
-- ClinicNow · Agente WhatsApp — Migração 001 (F1)
-- Spec vinculante: clinicnow/specs/SPEC-AGENTE-WHATSAPP.md (Arquitetura v1)
-- Aplicar via orquestrador no projeto Supabase existente. NÃO rodar duas vezes
-- sem conferir: usa IF NOT EXISTS para ser idempotente.
--
-- Modelo de segurança (service-role-only):
--   * RLS HABILITADA nas duas tabelas e NENHUMA policy criada.
--   * Sem policy, anon e authenticated não leem nem escrevem NADA.
--   * O papel service_role (usado só no servidor/webhook) ignora RLS por
--     definição do Supabase — é o único caminho de acesso na F1.
--   * O dashboard (F2) ganhará policies para authenticated quando existir.
-- ============================================================================

-- Conversas: uma linha por número de WhatsApp que já falou com o agente.
create table if not exists public.clinicnow_wa_conversas (
  id            uuid primary key default gen_random_uuid(),
  phone         text not null unique,          -- wa_id do lead (ex.: 5584999999999)
  nome          text,                          -- profile.name do contato Meta
  ai_paused     boolean not null default false, -- takeover: true = IA não responde
  intent_atual  text,                          -- última intent classificada
  criado_em     timestamptz not null default now()
);

-- Mensagens: cada mensagem de entrada (in) e saída (out) da conversa.
create table if not exists public.clinicnow_wa_mensagens (
  id           uuid primary key default gen_random_uuid(),
  message_id   text unique,                    -- id da Meta (dedup de retries); null em 'out'
  conversa_id  uuid not null references public.clinicnow_wa_conversas(id) on delete cascade,
  direction    text not null check (direction in ('in','out')),
  content      text not null,
  intent       text,                           -- obrigatória em 100% das 'in' (DoD 2) — imposta na aplicação
  model        text,                           -- modelo que gerou a resposta ('out')
  latency_ms   integer,                        -- latência ponta a ponta medida ('out')
  "timestamp"  timestamptz not null default now()
);

create index if not exists clinicnow_wa_mensagens_conversa_idx
  on public.clinicnow_wa_mensagens (conversa_id, "timestamp");

-- RLS: habilitada, sem policies → acesso exclusivo via service role (servidor).
alter table public.clinicnow_wa_conversas enable row level security;
alter table public.clinicnow_wa_mensagens enable row level security;

-- Cinto e suspensório: revoga grants padrão dos papéis de API pública.
revoke all on public.clinicnow_wa_conversas from anon, authenticated;
revoke all on public.clinicnow_wa_mensagens from anon, authenticated;
