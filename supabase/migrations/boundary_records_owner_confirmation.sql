-- Brad Wolfe, LinkedIn 10 Aug 2026, "The CEO's New Job" thread: "the person
-- has to be told. A seat named in a minute nobody circulated is not
-- accountability, it is a document that will be produced later at a worse
-- moment." owner_name is required at creation, but nothing currently
-- confirms the named owner actually knows they hold the seat -- whoever
-- creates the record could name a colleague who's never been told. Same
-- mechanism as required_by and completion confirmation: a token gating a
-- public link only the named owner acts on.
alter table boundary_authorization_records
  add column if not exists owner_confirmed_token text,
  add column if not exists owner_confirmed_at timestamptz,
  add column if not exists owner_confirmed_name text,
  add column if not exists owner_confirmed_email text;

create unique index if not exists boundary_authorization_records_owner_confirmed_token_idx
  on boundary_authorization_records (owner_confirmed_token)
  where owner_confirmed_token is not null;
