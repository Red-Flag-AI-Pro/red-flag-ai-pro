-- Public, ungated proof-of-existence sealing (Post Notary / Payment Notary
-- free tools, task #203/#204). No user_id: anyone can seal without an
-- account, and the server never receives plaintext content — only its
-- SHA-256 hash, computed in the visitor's browser via Web Crypto.
create table if not exists notary_seals (
  id uuid primary key default gen_random_uuid(),
  content_hash text not null,
  label text,
  created_at timestamptz not null default now(),
  ts_token text,
  ts_time text,
  ts_tsa text
);

create index if not exists idx_notary_seals_hash on notary_seals(content_hash);

alter table notary_seals enable row level security;
-- No policies: all access goes through the service role via API routes,
-- same pattern as audit_log.
