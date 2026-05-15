-- Red Flag AI Pro — Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- ── Tables ────────────────────────────────────────────────────────────────────

create table if not exists public.profiles (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references auth.users(id) on delete cascade not null unique,
  full_name           text,
  plan                text not null default 'free' check (plan in ('free', 'pro', 'enterprise')),
  stripe_customer_id  text,
  created_at          timestamptz not null default now()
);

create table if not exists public.scans (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  title       text not null default 'Untitled Scan',
  content     text not null,
  score       integer not null check (score between 0 and 100),
  status      text not null default 'complete' check (status in ('pending', 'complete', 'error')),
  created_at  timestamptz not null default now()
);

create table if not exists public.scan_flags (
  id               uuid primary key default gen_random_uuid(),
  scan_id          uuid references public.scans(id) on delete cascade not null,
  category         text not null,
  severity         text not null check (severity in ('low', 'medium', 'high')),
  text_excerpt     text,
  flag_description text not null,
  suggestion       text
);

-- ── Indexes ───────────────────────────────────────────────────────────────────

create index if not exists scans_user_id_created_at_idx
  on public.scans (user_id, created_at desc);

create index if not exists scan_flags_scan_id_idx
  on public.scan_flags (scan_id);

-- ── Row Level Security ────────────────────────────────────────────────────────

alter table public.profiles  enable row level security;
alter table public.scans     enable row level security;
alter table public.scan_flags enable row level security;

-- profiles
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

-- scans
create policy "Users can read own scans"
  on public.scans for select
  using (auth.uid() = user_id);

create policy "Users can insert own scans"
  on public.scans for insert
  with check (auth.uid() = user_id);

-- scan_flags (access via scan ownership)
create policy "Users can read flags for own scans"
  on public.scan_flags for select
  using (
    exists (
      select 1 from public.scans
      where scans.id = scan_flags.scan_id
        and scans.user_id = auth.uid()
    )
  );

create policy "Users can insert flags for own scans"
  on public.scan_flags for insert
  with check (
    exists (
      select 1 from public.scans
      where scans.id = scan_flags.scan_id
        and scans.user_id = auth.uid()
    )
  );

-- ── Auto-create profile on signup ─────────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, full_name)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute procedure public.handle_new_user();
