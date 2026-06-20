-- HOTFIX — Run in Supabase SQL Editor
-- The API route (src/app/api/governance-audit/route.ts) has always inserted a
-- `roadmap` field, but the original table never had that column. Every single
-- submission to /api/governance-audit has been failing with a 500 (PGRST204:
-- "Could not find the 'roadmap' column") since this tool launched.

alter table public.governance_audit_emails
  add column if not exists roadmap jsonb not null default '[]';
