-- The "whether" leg of the authorization record: a grant needs a shelf life
-- stamped on it the same way a signature needs a name. expires_at is required
-- for new records at the API layer; it stays nullable here so records created
-- before this migration remain readable (the UI surfaces them as "No expiry
-- set" rather than pretending they were bounded).
--
-- expiry_conditions holds the falsifiers: observable conditions that void the
-- grant ("this authority stops being valid if X"). The falsifier IS the expiry
-- condition — the same written-down test that gates approval also triggers the
-- lapse, so no separate revocation mechanism is needed.
--
-- Run in the Supabase SQL editor.

alter table boundary_authorization_records
  add column if not exists expires_at date,
  add column if not exists expiry_conditions jsonb not null default '[]'::jsonb;
