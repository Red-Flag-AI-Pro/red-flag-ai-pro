-- Clients and Monitored URLs — Run in Supabase SQL Editor

-- 1. Clients table
create table if not exists public.clients (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  organisation_id uuid references public.organisations(id) on delete set null,
  name          text not null,
  website       text,
  notes         text,
  created_at    timestamptz not null default now()
);

alter table public.clients enable row level security;

create policy "Users can manage own clients"
  on public.clients for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Team members can read org clients"
  on public.clients for select
  using (
    exists (
      select 1 from public.profiles p1
      join public.profiles p2 on p1.organisation_id = p2.organisation_id
      where p1.user_id = auth.uid()
        and p2.user_id = clients.user_id
        and p1.organisation_id is not null
    )
  );

-- 2. Add client_id to scans
alter table public.scans
  add column if not exists client_id uuid references public.clients(id) on delete set null;

-- 3. Monitored URLs table
create table if not exists public.monitored_urls (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id) on delete cascade not null,
  client_id       uuid references public.clients(id) on delete set null,
  url             text not null,
  label           text,
  last_scanned_at timestamptz,
  last_score      integer,
  last_scan_id    uuid references public.scans(id) on delete set null,
  created_at      timestamptz not null default now()
);

alter table public.monitored_urls enable row level security;

create policy "Users can manage own monitored urls"
  on public.monitored_urls for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Team members can read org monitored urls"
  on public.monitored_urls for select
  using (
    exists (
      select 1 from public.profiles p1
      join public.profiles p2 on p1.organisation_id = p2.organisation_id
      where p1.user_id = auth.uid()
        and p2.user_id = monitored_urls.user_id
        and p1.organisation_id is not null
    )
  );
