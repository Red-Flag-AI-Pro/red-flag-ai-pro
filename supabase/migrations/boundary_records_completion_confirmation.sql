-- Michael H., LinkedIn 10 Aug 2026: completion_condition (task #280) states
-- what success looks like, but nothing confirms it happened -- it's a
-- statement of intent at signing, not evidence. "The test is whether an
-- independent assessor can establish that the objective was met without
-- relying on the actor's own account of it." A field the owner fills in
-- themselves can never answer that, no matter what it's called.
--
-- Same mechanism as required_by_confirmation (external party, link only
-- they act on, not the account holder typing into their own form):
-- completion_token gates a public confirmation page, completion_confirmed_at
-- is null until someone outside the account visits it and confirms.
--
-- completion_confirmed_note is required, not optional -- a bare timestamp
-- with a name attached is still just a diary entry. The note is what makes
-- it evidence: how the confirmer actually knows, not just that they clicked
-- a button.
alter table boundary_authorization_records
  add column if not exists completion_token text,
  add column if not exists completion_confirmed_at timestamptz,
  add column if not exists completion_confirmed_name text,
  add column if not exists completion_confirmed_email text,
  add column if not exists completion_confirmed_note text;

create unique index if not exists idx_boundary_records_completion_token
  on boundary_authorization_records(completion_token)
  where completion_token is not null;
