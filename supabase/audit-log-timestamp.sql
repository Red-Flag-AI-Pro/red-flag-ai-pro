-- RFC 3161 trusted timestamps for audit-log entries.
-- Each entry can carry a signed timestamp token from a third-party Time
-- Stamping Authority, proving the record existed and was unaltered at a
-- point in time, verifiable without trusting Red Flag's database.

alter table public.audit_log
  add column if not exists ts_token text,       -- base64 RFC 3161 TimeStampToken
  add column if not exists ts_time  timestamptz, -- genTime asserted by the TSA
  add column if not exists ts_tsa   text;        -- which authority signed it
