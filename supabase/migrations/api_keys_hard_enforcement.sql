alter table public.api_keys add column if not exists hard_enforcement boolean not null default false;
