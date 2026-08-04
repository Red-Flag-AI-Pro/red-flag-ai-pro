-- Boundary authorization records so far only described decisions in free
-- text. An API key or agent credential is the same kind of grant, standing
-- authority for a system to act, so it gets the same record: what kind of
-- grant this is, and a non-secret reference identifying which credential
-- (a key name or last four characters, NEVER the secret itself).
alter table boundary_authorization_records
  add column if not exists grant_type text not null default 'decision'
    check (grant_type in ('decision', 'credential')),
  add column if not exists credential_reference text;
