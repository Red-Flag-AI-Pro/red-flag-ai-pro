-- Applications to join the witness network. Written only by the service
-- role from /api/witness/apply; RLS on with no policies so no client can
-- read or write it directly.
create table if not exists public.witness_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  company text not null,
  website text not null,
  contact_name text not null,
  email text not null,
  records_kept text not null,
  why_join text,
  status text not null default 'new'
);

create index if not exists witness_applications_created_at_idx
  on public.witness_applications (created_at desc);

alter table public.witness_applications enable row level security;
