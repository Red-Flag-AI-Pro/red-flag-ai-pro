-- Michael H., "Beyond the AI Register," 9 Aug 2026: his bounded-delegation
-- test asks six things a record should answer, including what would count
-- as the objective being successfully complete. expiry_conditions already
-- model how a grant dies (falsifiers). Nothing models what it looks like
-- for it to succeed. This adds that missing positive half.
--
-- completion_condition: one free text statement, optional, not tied to
-- expires_at. Recording it is a fact about intent at signing, not a
-- trigger — it never changes the expiry itself, unlike a falsifier.
alter table boundary_authorization_records
  add column if not exists completion_condition text;
