-- Brad Wolfe, "How to let finance use AI and still be able to sign," 10 Aug
-- 2026: boundary authorization records and API key governance prove who's
-- accountable for an AI credential or connection overall. Neither proves who
-- signed off on THIS specific number, document, or output at the moment it
-- was certified -- a different granularity, and a genuine gap, checked
-- honestly against the schema before this was added.
--
-- Follow-up, same thread: identity must be frozen, not resolved by pointer.
-- A user_id looked up later reads wrong the moment a role changes -- exactly
-- the case this exists for. So accepted_by_name/accepted_by_role are text,
-- captured at the moment of sign-off, same discipline as owner_name/
-- owner_role on boundary_authorization_records already follows.
--
-- Keyed by document key, same JSONB-per-document-key pattern as
-- document_reviews and current_documents on this same table. Deliberately
-- optional and light -- his own warning: "if it touches everything, the
-- classification was never done." Not every document gets one, only the
-- ones a customer is actually certifying something against.
alter table program_orders
  add column if not exists artifact_signoffs jsonb not null default '{}'::jsonb;
