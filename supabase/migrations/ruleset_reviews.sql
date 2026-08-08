-- Answers Brad Wolfe's "population of one" point (7 Aug 2026 LinkedIn thread):
-- RULESET_VERSION (src/lib/analyzer.ts) already proves WHICH rules produced a
-- decision. This table proves whether anyone has actually looked at those
-- rules again since, and who is accountable for that. A ruleset with no
-- review row for its current version, or a lapsed next_review_due, is
-- provably stale rather than just old.

create table if not exists ruleset_reviews (
  id uuid primary key default gen_random_uuid(),

  -- The RULESET_VERSION hash in force at the time of this review. Compared
  -- against the live analyzer.ts export to detect drift since the review.
  ruleset_version text not null,

  reviewed_by text not null,
  reviewer_role text not null,
  context_note text,

  next_review_due date,

  created_at timestamptz not null default now()
);

create index if not exists idx_ruleset_reviews_created_at on ruleset_reviews(created_at desc);

alter table ruleset_reviews enable row level security;

-- Public read: the whole point is that anyone can verify the ruleset has a
-- real, dated, named review behind it, not just trust a claim.
create policy "anyone can view ruleset reviews" on ruleset_reviews
  for select using (true);

-- No insert/update policy for anon/authenticated — writes happen only via
-- the admin API route using the service role.
