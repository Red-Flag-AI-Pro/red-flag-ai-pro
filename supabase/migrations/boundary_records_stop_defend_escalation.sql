-- Task #262, 9 Aug 2026. Brad Wolfe (5 Aug): of
-- the four things that transfer down to companies without full institutional
-- apparatus (named owner, one-sentence boundary, expiry date, someone who can
-- stop it who isn't the person who built it), the fourth was missing. Dr.
-- David Marco, same week, independently named two more distinct roles: who
-- must defend the decision under challenge, and where escalation ends. All
-- optional -- for a solo founder or small business there is often no
-- separate person to name, and an empty field here is honest, not a gap.
alter table public.boundary_authorization_records
  add column if not exists stop_authority_name text,
  add column if not exists stop_authority_role text,
  add column if not exists defend_authority_name text,
  add column if not exists defend_authority_role text,
  add column if not exists escalation_ceiling text;
