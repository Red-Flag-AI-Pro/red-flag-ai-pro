-- Store the content the visitor pasted into the demo scanner against their
-- claimed email, so that if/when they sign up with that same email, we can
-- convert their demo scan into their first real (fully unlocked) scan —
-- instead of greeting them with an empty dashboard and making them redo work
-- they already did.
alter table public.demo_scan_emails
  add column if not exists content text;
