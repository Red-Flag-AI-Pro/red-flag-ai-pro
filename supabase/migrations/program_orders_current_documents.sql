-- Brad Wolfe, 10 Aug 2026: sealing and dependency are opposite instincts,
-- extending expiry onto the sealed six documents (task #281) conflates them
-- on one artifact. "Sealing says this must not change. Dependency says this
-- must change when the world does." His prescription: split into a sealed
-- record of what was agreed at handover, which never changes, and a live
-- version wired to whatever it governs, which is what the client operates
-- from.
--
-- The six document columns (dpia, fria, etc.) plus seal_id/seal_content_sha256
-- stay exactly as they are -- that is now explicitly the frozen half, never
-- touched again after delivery. This column is the new live half: per
-- document key, present only once a customer has confirmed something
-- actually changed since delivery. Absent key means the current version
-- still matches what was sealed -- an honest default, not a placeholder.
alter table public.program_orders
  add column if not exists current_documents jsonb not null default '{}'::jsonb;

comment on column public.program_orders.current_documents is
  'Per-document-key divergence from the sealed original. Each entry: {note, updated_at}. A missing key means the current version still matches the sealed one.';
