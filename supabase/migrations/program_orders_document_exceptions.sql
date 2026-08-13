-- Counterparty exception records (Brad Wolfe thread, 12-13 Aug 2026). Kept
-- separate from artifact_signoffs on purpose: the genericity detector and
-- the sign-off panel both read "the latest event" from that array, and an
-- exception appended there would silently change what "latest" means.
alter table program_orders add column if not exists document_exceptions jsonb;
