-- Task #281, 9 Aug 2026. Brad Wolfe's "every system implementation leaves
-- a folder behind" post: the six £497 program documents get sealed once at
-- completion, which proves nobody edited them but does not stop them going
-- silently stale. This column tracks, per document key, the last time the
-- customer confirmed a document is still accurate. See
-- src/lib/program-document-review.ts for how the review-due date and
-- staleness are computed, and src/app/api/data-room/export/route.ts for
-- the actual gate: a stale document is excluded from a Data Room export
-- rather than silently included.
alter table public.program_orders
  add column if not exists document_reviews jsonb not null default '{}'::jsonb;
