alter table public.api_keys add column if not exists hard_enforcement_accepted_by text;
alter table public.api_keys add column if not exists hard_enforcement_accepted_at timestamptz;
alter table public.enforcement_decisions add column if not exists hard_enforcement_accepted_by text;
alter table public.enforcement_decisions add column if not exists hard_enforcement_accepted_at timestamptz;
