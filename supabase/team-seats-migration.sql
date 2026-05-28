-- Team Seats Migration — Run in Supabase SQL Editor

-- 1. Update plan check to include sentinel
alter table public.profiles
  drop constraint if exists profiles_plan_check;

alter table public.profiles
  add constraint profiles_plan_check
  check (plan in ('free', 'pro', 'enterprise', 'sentinel'));

-- 2. Organisations table
create table if not exists public.organisations (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid references auth.users(id) on delete cascade not null,
  name        text not null default 'My Organisation',
  invite_code text not null unique default upper(substring(gen_random_uuid()::text, 1, 8)),
  created_at  timestamptz not null default now()
);

-- 3. Add organisation_id to profiles
alter table public.profiles
  add column if not exists organisation_id uuid references public.organisations(id) on delete set null;

-- 4. RLS on organisations
alter table public.organisations enable row level security;

create policy "Owners can read own organisation"
  on public.organisations for select
  using (auth.uid() = owner_id);

create policy "Members can read their organisation"
  on public.organisations for select
  using (
    exists (
      select 1 from public.profiles
      where profiles.organisation_id = organisations.id
        and profiles.user_id = auth.uid()
    )
  );

create policy "Owners can insert organisation"
  on public.organisations for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update organisation"
  on public.organisations for update
  using (auth.uid() = owner_id);

-- 5. Allow team members to see all scans in their organisation
create policy "Team members can read org scans"
  on public.scans for select
  using (
    exists (
      select 1 from public.profiles p1
      join public.profiles p2 on p1.organisation_id = p2.organisation_id
      where p1.user_id = auth.uid()
        and p2.user_id = scans.user_id
        and p1.organisation_id is not null
    )
  );

-- 6. Allow team members to read flags for org scans
create policy "Team members can read flags for org scans"
  on public.scan_flags for select
  using (
    exists (
      select 1 from public.scans
      join public.profiles p1 on p1.user_id = auth.uid()
      join public.profiles p2 on p2.user_id = scans.user_id
      where scans.id = scan_flags.scan_id
        and p1.organisation_id = p2.organisation_id
        and p1.organisation_id is not null
    )
  );
