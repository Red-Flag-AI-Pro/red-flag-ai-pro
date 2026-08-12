-- Task #137: canary checks on program documents. One flat array of events,
-- same append pattern as artifact_signoffs. RLS on program_orders already
-- restricts rows to their owner; this column inherits that.
alter table program_orders add column if not exists canary_checks jsonb;
