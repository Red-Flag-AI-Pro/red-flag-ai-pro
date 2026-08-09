-- Task #283, 9 Aug 2026. Greggory Don Butler's sixth admissibility test on Dr
-- Moya Hill's "Governing AI's Internal Records" post: dependency changes. The
-- permission fingerprint (src/lib/permission-fingerprint.ts) only ever hashed
-- approved_threshold, so a vendor could silently swap the model behind a
-- credential and the sealed fingerprint would still match -- "the grounds
-- still hold" was checked, "the same thing is still running" was not.
--
-- model_version is a free-text identifier the key owner supplies (e.g.
-- "claude-sonnet-4-20250514", "gpt-4-turbo-2024-04-09"). It's now part of the
-- fingerprint material, so changing it is itself detectable drift on any
-- boundary record linked to the key, the same mechanism approved_threshold
-- already gets.
alter table public.api_keys
  add column if not exists model_version text;
