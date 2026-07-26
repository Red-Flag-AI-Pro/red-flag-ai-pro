-- Opt-in public sharing for scan reports.
-- A report is PRIVATE by default. It only becomes viewable by a logged-out
-- visitor once its owner explicitly shares it (sets is_public = true via the
-- Share button, which calls /api/scans/[id]/share scoped to the owner).
--
-- The public read paths (share page, badge) use the service-role client and
-- filter on is_public = true, so RLS stays fully locked and nothing private
-- is ever exposed. This column is the single gate.

alter table public.scans
  add column if not exists is_public boolean not null default false;

-- Fast lookups for the public reads (only shared rows are ever fetched anon).
create index if not exists idx_scans_is_public
  on public.scans (id)
  where is_public = true;
