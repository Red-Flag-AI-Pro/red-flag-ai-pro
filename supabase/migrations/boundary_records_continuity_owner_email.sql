-- Lets a renewal reminder reach the continuity owner directly, rather than
-- only the account holder. Optional: a record with no continuity owner (or
-- no email for them) still falls back to the account holder's own email in
-- the reminder cron, since that address always exists.
alter table boundary_authorization_records
  add column if not exists continuity_owner_email text;
