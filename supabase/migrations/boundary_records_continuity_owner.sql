-- Who holds the duty to renew a boundary authorization or arrange a
-- successor before it lapses, distinct from owner_name who holds the
-- authority itself. A lapse only proves the seat went empty, not who was
-- accountable for it going empty — this field is what lets the lapse-check
-- cron name that person directly in the sealed event instead of leaving it
-- as an inference.
alter table boundary_authorization_records
  add column if not exists continuity_owner_name text,
  add column if not exists continuity_owner_role text;
