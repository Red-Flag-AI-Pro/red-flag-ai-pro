-- Lightweight rate limiting store for public, unauthenticated endpoints
-- (starting with the witness network anchor/push routes). No Redis/KV
-- provisioned yet, so this rides on the database that's already durable.

create table if not exists public.rate_limits (
  id bigint generated always as identity primary key,
  rate_key text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_rate_limits_key_created on public.rate_limits (rate_key, created_at desc);

alter table public.rate_limits enable row level security;
-- No policies: only the service role (server-side) ever touches this table.
