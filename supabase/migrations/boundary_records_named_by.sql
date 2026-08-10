-- Brad Wolfe, "The CEO's New Job," LinkedIn 10 Aug 2026: owner_name/owner_role
-- record who holds the accountable seat, not who named them to it. "A seat
-- that assigns its own accountability is just marking its own homework" --
-- his exact line. named_by_name/named_by_role are optional and free text: for
-- a solo founder there's often no separate apex above the owner, and leaving
-- this blank or writing "self assigned" is an honest answer, not a gap.
alter table boundary_authorization_records
  add column if not exists named_by_name text,
  add column if not exists named_by_role text;
