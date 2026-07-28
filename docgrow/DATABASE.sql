-- ============================================================
-- DocGrow — Fundação de dados (5 camadas)
-- Espelho da migração aplicada em 28/07/2026 no Supabase
-- Projeto: yaqphldowpshhrtvvfaq (São Paulo · LGPD)
-- Este arquivo é documentação versionada do schema em produção.
-- Alterações de schema: aplicar via migração no Supabase e
-- atualizar este espelho no mesmo commit.
-- ============================================================

-- ── Camada 1 · Identidade ───────────────────────────────────
-- Quem é o médico. id = auth.users.id (1:1 com o login).
create table if not exists docgrow_profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  nome          text not null,
  email         text,
  whatsapp      text,
  especialidade text,
  nicho         text,
  pais          text default 'BR',
  moeda         text default 'BRL',
  plano         text default 'start',        -- start | pro | aceleracao
  origem        text default 'site',
  criado_em     timestamptz default now()
);

-- ── Camada 2 · Funil ────────────────────────────────────────
-- medgroth_leads (tabela já existente) permanece como entrada do funil:
-- insert anônimo pela captura, leitura só autenticada.
create table if not exists docgrow_diagnosticos (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid references docgrow_profiles(id) on delete set null,
  lead_id      uuid references medgroth_leads(id) on delete set null,
  respostas    jsonb not null,
  score        integer,
  plano_gerado jsonb,                        -- plano de 4 semanas gerado pela IA
  criado_em    timestamptz default now()
);

-- ── Camada 3 · Operação ─────────────────────────────────────
create table if not exists docgrow_pacientes (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references docgrow_profiles(id) on delete cascade,
  nome       text not null,
  whatsapp   text,
  email      text,
  origem     text default 'indicacao',
  status     text default 'ativo',
  tags       text[],
  criado_em  timestamptz default now()
);

create table if not exists docgrow_consultas (
  id                uuid primary key default gen_random_uuid(),
  profile_id        uuid not null references docgrow_profiles(id) on delete cascade,
  paciente_id       uuid references docgrow_pacientes(id) on delete set null,
  inicio            timestamptz not null,
  fim               timestamptz,
  tipo              text default 'presencial',   -- presencial | tele
  consentimento_tele boolean default false,      -- obrigatório p/ tipo=tele (Res. CFM 2.314/2022)
  status            text default 'agendada',     -- agendada | confirmada | realizada | no_show | cancelada
  link_tele         text,
  valor             numeric,
  pago              boolean default false,
  criado_em         timestamptz default now()
);

create table if not exists docgrow_followups (
  id             uuid primary key default gen_random_uuid(),
  profile_id     uuid not null references docgrow_profiles(id) on delete cascade,
  paciente_id    uuid references docgrow_pacientes(id) on delete set null,
  tipo           text not null,                -- confirmacao | recall | retorno | pos_consulta
  devido_em      timestamptz not null,
  enviado_em     timestamptz,
  status         text default 'pendente',      -- pendente | enviado | respondido | convertido | expirado
  resultado_valor numeric,                     -- R$ atribuído quando o follow-up converte (alimenta o Cofre)
  criado_em      timestamptz default now()
);

-- ── Camada 4 · Receita ──────────────────────────────────────
create table if not exists docgrow_protocolos (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid not null references docgrow_profiles(id) on delete cascade,
  nome         text not null,
  descricao    text,
  preco_mensal numeric,
  moeda        text default 'BRL',
  ativo        boolean default true,
  criado_em    timestamptz default now()
);

-- Ponte futura com o CareLoop (módulo-piloto só após gatilho do comitê:
-- 10 clientes pagantes + parecer jurídico ANS).
create table if not exists docgrow_assinaturas_pacientes (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid not null references docgrow_profiles(id) on delete cascade,
  paciente_id  uuid not null references docgrow_pacientes(id) on delete cascade,
  protocolo_id uuid references docgrow_protocolos(id) on delete set null,
  status       text default 'ativa',           -- ativa | pausada | cancelada
  valor        numeric not null,
  iniciada_em  timestamptz default now(),
  cancelada_em timestamptz
);

create table if not exists docgrow_pagamentos (
  id            uuid primary key default gen_random_uuid(),
  profile_id    uuid not null references docgrow_profiles(id) on delete cascade,
  assinatura_id uuid references docgrow_assinaturas_pacientes(id) on delete set null,
  consulta_id   uuid references docgrow_consultas(id) on delete set null,
  valor         numeric not null,
  moeda         text default 'BRL',
  metodo        text,                          -- pix | cartao | outro
  status        text default 'pendente',       -- pendente | pago | recusado | estornado
  externo_id    text,                          -- id no gateway (a definir no Sprint 2)
  criado_em     timestamptz default now()
);

-- ── Camada 5 · Inteligência ─────────────────────────────────
-- Log auditável de eventos do produto e da IA (regra 5: IA com guarda-corpos).
create table if not exists docgrow_eventos (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid references docgrow_profiles(id) on delete set null,
  tipo       text not null,                    -- ex.: ia_script_gerado, diagnostico_concluido
  payload    jsonb,
  criado_em  timestamptz default now()
);

create table if not exists docgrow_metas (
  id             uuid primary key default gen_random_uuid(),
  profile_id     uuid not null references docgrow_profiles(id) on delete cascade,
  mes            date not null,
  meta_receita   numeric,
  meta_consultas integer,
  realizado      jsonb,
  unique (profile_id, mes)
);

-- Practice Health Score (0–100): completude do perfil + base de pacientes
-- + consultas 30d + receita paga 30d + follow-ups ativos 30d.
-- Tela inicial do app no Sprint 2 (decisão do comitê).
create or replace view docgrow_health_score as
select p.id as profile_id,
  least(100, greatest(0,
    case when p.especialidade is not null and p.whatsapp is not null then 20 else 10 end
    + least(20, (select count(*)::int * 2 from docgrow_pacientes pa where pa.profile_id = p.id))
    + least(20, (select count(*)::int * 4 from docgrow_consultas c
                 where c.profile_id = p.id and c.status in ('confirmada','realizada')
                   and c.inicio > now() - interval '30 days'))
    + least(20, coalesce((select sum(pg.valor) / 500 from docgrow_pagamentos pg
                 where pg.profile_id = p.id and pg.status = 'pago'
                   and pg.criado_em > now() - interval '30 days'), 0)::int)
    + least(20, (select count(*)::int * 5 from docgrow_followups f
                 where f.profile_id = p.id and f.status in ('enviado','respondido','convertido')
                   and f.criado_em > now() - interval '30 days'))
  )) as score,
  now() as calculado_em
from docgrow_profiles p;

-- Cofre de Receita Recuperada: R$ que o produto devolveu ao médico
-- (no-shows evitados + recalls/retornos convertidos). Prova de valor medida — nunca promessa.
create or replace view docgrow_cofre_recuperado as
select profile_id,
  coalesce(sum(resultado_valor), 0) as total_recuperado,
  count(*) filter (where tipo = 'confirmacao' and status = 'respondido')             as no_shows_evitados,
  count(*) filter (where tipo in ('recall','retorno') and status = 'convertido')      as retornos_convertidos
from docgrow_followups
group by profile_id;

-- ── RLS ─────────────────────────────────────────────────────
-- Todas as tabelas têm RLS habilitada com política dono-único:
--   using (profile_id = auth.uid())  [em docgrow_profiles: id = auth.uid()]
-- Exceções: docgrow_diagnosticos aceita insert anônimo (funil de captura,
-- espelho do padrão de medgroth_leads); leitura sempre autenticada.
-- As políticas vivem na migração aplicada no Supabase em 28/07/2026.
