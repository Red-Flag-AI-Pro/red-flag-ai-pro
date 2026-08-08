-- The small version of "required by" (required_by_name/organisation) shipped
-- 8 Aug 2026 is self reported: the account holder names who required the
-- boundary, but nobody outside confirms it. This is the real version Brad
-- Wolfe's point was actually describing — the external party themselves
-- genuinely confirming, via a link only they act on, not the account holder
-- typing a name into their own form.
--
-- required_by_token: a high entropy secret (128 bits via gen_random_bytes),
-- generated on request, the link the external party is actually sent.
-- Knowing this token is what lets someone view and confirm the record's
-- terms, so it has to be unguessable, the same reasoning behind the 80 bit
-- team invite code fix (team_join_requests.sql).
--
-- required_by_confirmed_at / required_by_confirmed_name / _email: null until
-- the external party visits the link and confirms. Once set, these are the
-- external party's own words, typed by them, not by the account holder —
-- the actual distinction the whole feature exists to make provable.
alter table boundary_authorization_records
  add column if not exists required_by_token text,
  add column if not exists required_by_confirmed_at timestamptz,
  add column if not exists required_by_confirmed_name text,
  add column if not exists required_by_confirmed_email text;

create unique index if not exists idx_boundary_records_required_by_token
  on boundary_authorization_records(required_by_token)
  where required_by_token is not null;
