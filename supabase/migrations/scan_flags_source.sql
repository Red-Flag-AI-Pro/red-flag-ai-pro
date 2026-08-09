-- Task #287, 9 Aug 2026. Moe Hachem, LinkedIn: separate confirmed material
-- from inference before anything gets relied on. A flag from the
-- deterministic keyword engine is reproducible by anyone re-running the
-- rules; a flag the AI enhancement pass added on its own is inference. Both
-- were previously indistinguishable once merged into one array. Default
-- 'keyword' covers every flag ever written before this column existed, all
-- of which came from the keyword-only pipeline at the time.
alter table public.scan_flags
  add column if not exists source text not null default 'keyword' check (source in ('keyword', 'ai'));
