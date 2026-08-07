-- Team invite used to grant organisation membership the instant a valid
-- invite_code was submitted, no owner ever saw or approved it. Anyone who
-- got hold of the code (or brute forced the 8 hex character default) was in.
-- This makes joining a request the owner has to act on, not a code redemption.

CREATE TABLE IF NOT EXISTS team_join_requests (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'denied')),
  requested_at timestamptz not null default now(),
  decided_at timestamptz,
  unique (organisation_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_team_join_requests_org_status ON team_join_requests(organisation_id, status);

-- Invite codes were 8 hex characters (32 bits) with no rate limit on the
-- join endpoint that checks them, brute forceable given enough automated
-- attempts. 20 hex characters (80 bits) via gen_random_bytes closes that,
-- paired with the rate limit added on /api/team/join in the same change.
ALTER TABLE organisations ALTER COLUMN invite_code SET DEFAULT upper(encode(gen_random_bytes(10), 'hex'));
UPDATE organisations SET invite_code = upper(encode(gen_random_bytes(10), 'hex'));
