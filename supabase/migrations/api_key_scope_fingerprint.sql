-- Closes the drift gap in credential-type boundary authorization records.
--
-- Until now a credential grant record named its key in free text
-- (credential_reference) and nothing tied the record to the key's actual
-- live permissions. A record could say "approved" forever while the key's
-- real scope changed underneath it, and nothing would notice — the exact
-- "badge that was true once" failure the whole record system exists to
-- prevent.
--
-- approved_threshold is the key's stored permission scope: the minimum
-- compliance score the Real-Time Gate will accept for content published
-- under this key. NULL means never configured — legacy keys keep their
-- current caller-supplied-threshold behaviour until an approved threshold
-- is set or a boundary record is linked.
--
-- api_key_id replaces free text with a real reference, so the record is
-- provably about one specific key. permission_fingerprint is a content
-- hash of the key's approved scope taken at the moment of approval, same
-- pattern as RULESET_VERSION: if the live scope later stops matching the
-- sealed fingerprint, the drift is detectable mechanically, not by a
-- person happening to notice.
--
-- Run in the Supabase SQL editor.

alter table api_keys
  add column if not exists approved_threshold integer
    check (approved_threshold >= 0 and approved_threshold <= 100);

alter table boundary_authorization_records
  add column if not exists api_key_id uuid references api_keys(id) on delete set null,
  add column if not exists permission_fingerprint text;

create index if not exists idx_boundary_records_api_key_id
  on boundary_authorization_records(api_key_id)
  where api_key_id is not null;
