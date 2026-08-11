-- Four independent gaps surfaced 10-11 Aug 2026, same night as owner
-- confirmation and the stop/defend/escalation fields. Each is additive,
-- optional, and follows the append-don't-overwrite discipline already used
-- for owner_confirmed_*/required_by_confirmed_*/completion_confirmed_*.

-- 1. Moe Hachem and Midhun K., LinkedIn 10-11 Aug 2026, independently:
-- ownership tells you whether the switch could be taken away, not whether
-- anyone has a tested plan for the day it is. required_by/owner already
-- capture who holds authority; nothing captures what this decision itself
-- depends on outside the account, or whether losing it was ever rehearsed.
-- Each entry: { name, organisation, fallback_tested, fallback_note, added_at }.
alter table boundary_authorization_records
  add column if not exists external_dependencies jsonb not null default '[]';

-- 2. risks_accepted is the owner's OWN stated risk, accepted knowingly at
-- signing. This is a different fact: a warning raised by someone ELSE that
-- got overridden. A record with a clean risks_accepted list and a buried
-- dissent looks identical to one where nobody ever objected, unless the
-- dissent has its own field. override_reason is required in the form, no
-- blank saves -- same discipline as completion_confirmed_note.
-- Each entry: { source_name, source_role, warning_text, overridden_at, override_reason }.
alter table boundary_authorization_records
  add column if not exists warnings_overridden jsonb not null default '[]';

-- 3. owner_confirmed_at only ever answers "did they once know they held
-- this seat" -- nothing re-checks later whether they still do, and roles
-- change. Reuses the existing owner_confirmed_token column: requesting
-- confirmation on an already-confirmed record overwrites it with a fresh
-- token rather than minting a new column, but writes the result to these
-- NEW fields, so the original "first confirmed" fact stays permanent and
-- untouched and reconfirmation is recorded as its own, later fact.
alter table boundary_authorization_records
  add column if not exists owner_reconfirmation_requested_at timestamptz,
  add column if not exists owner_reconfirmed_at timestamptz,
  add column if not exists owner_reconfirmed_name text,
  add column if not exists owner_reconfirmed_role text;

-- 5. scan_flags captures reviewer_role/reviewer_mandate on every sign-off
-- (see FlagList.tsx); boundary record confirmations never adopted the same
-- discipline -- owner/required_by/completion confirmations record a name
-- and an email but never the capacity the confirmer was acting in. Role and
-- mandate audit stamp, task #279.
alter table boundary_authorization_records
  add column if not exists owner_confirmed_role text,
  add column if not exists required_by_confirmed_role text,
  add column if not exists completion_confirmed_role text;
