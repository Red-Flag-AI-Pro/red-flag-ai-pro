-- Anonymous usage tracking, decoupled entirely from email capture. Lets us
-- see how many people actually complete a free tool (governance assessment,
-- compliance scan, etc), regardless of whether they ever give an email.
-- No PII: just which tool, an optional score, and when.
create table if not exists tool_usage_events (
  id uuid primary key default gen_random_uuid(),
  tool text not null,
  score integer,
  created_at timestamptz not null default now()
);

alter table tool_usage_events enable row level security;

-- Public can log a completion (anonymous, no PII) but cannot read the table.
-- Reads happen via the service role key only (diagnostic scripts, future dashboard).
create policy "anyone can log tool usage" on tool_usage_events
  for insert
  to anon, authenticated
  with check (true);
