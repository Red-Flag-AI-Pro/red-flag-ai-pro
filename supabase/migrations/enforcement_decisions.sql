-- Real-Time Gate: synchronous allow/block decisions, called before content
-- goes live rather than checked after the fact. Full content is stored
-- (truncated), matching the existing /api/v1/scan pattern, since a customer
-- reviewing why something was blocked needs to see what was evaluated, not
-- just its hash.
create table if not exists enforcement_decisions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  content text,
  score integer not null,
  threshold integer not null,
  allowed boolean not null,
  flag_count integer not null default 0,
  flags jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_enforcement_decisions_user on enforcement_decisions(user_id, created_at desc);

alter table enforcement_decisions enable row level security;
-- No policies: writes go through the service role from the API route,
-- same pattern as audit_log and notary_seals.
