-- Remediation tracking: a flag being found and disposed is not the same as
-- the underlying issue actually being fixed. This is a distinct, later
-- confirmation, sealed with its own timestamp, separate from the original
-- disposition, so "resolved" (a reviewer's judgment call) and "remediated"
-- (confirmation the fix actually happened) don't collapse into one event.
alter table scan_flags
  add column if not exists remediated_at timestamptz,
  add column if not exists remediated_note text;
