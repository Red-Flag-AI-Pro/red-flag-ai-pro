-- Demo scanner email gate — Run in Supabase SQL Editor
-- Tracks which email addresses have used the public, no-signup demo
-- scanner so each address only gets one free scan.

create table if not exists public.demo_scan_emails (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  created_at  timestamptz not null default now()
);

-- Service-role only — this table is written/read exclusively from the
-- /api/demo-scan route using the service client, never from the browser.
alter table public.demo_scan_emails enable row level security;

create policy "Service role manages demo scan emails"
  on public.demo_scan_emails for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
