-- Distinct from ruleset_reviews. A review records that a named person looked
-- at the ruleset again. A back-test records something a person can't just
-- assert: whether real, externally sourced incidents (ASA rulings, not our
-- own logs) would actually have been caught by the current category list.
--
-- Brad Wolfe, LinkedIn, 8 Aug 2026: "the only evidence the list is wrong is
-- a violation it did not flag, and that event never appears anywhere in the
-- system that missed it. It appears in someone else's record... Firing rate
-- tells you the thresholds are holding. Only the miss rate tells you the
-- list was ever the right list."

create table if not exists ruleset_backtests (
  id uuid primary key default gen_random_uuid(),

  ruleset_version text not null,

  -- Where the incidents came from — must be an external, independent
  -- source (a regulator's rulings, not our own scan history), or this
  -- isn't a real back-test, it's the system grading its own homework.
  sample_source text not null,
  sample_size integer not null,

  catches integer not null,
  misses integer not null,

  -- Each miss: what happened, why no current category covers it.
  -- [{ "name": "...", "ruling_url": "...", "gap": "..." }]
  miss_examples jsonb not null default '[]',

  performed_by text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_ruleset_backtests_created_at on ruleset_backtests(created_at desc);

alter table ruleset_backtests enable row level security;

create policy "anyone can view ruleset backtests" on ruleset_backtests
  for select using (true);

-- No insert/update policy for anon/authenticated — writes happen only via
-- the admin API route using the service role.
