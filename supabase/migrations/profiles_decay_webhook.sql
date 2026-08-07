-- A separate webhook from profiles.webhook_url on purpose. That column is
-- dedicated to per-scan completion payloads (task #165); decay alerts are a
-- different signal on a different cadence, and a customer who wants one but
-- not the other shouldn't have to choose.

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS decay_webhook_url TEXT;
