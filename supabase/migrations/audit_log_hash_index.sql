-- Supports absence-proof bracketing queries (find the two chain entries
-- immediately either side of a hash that isn't present), which need to
-- range-scan ordered by hash within a user's chain rather than by time.

CREATE INDEX IF NOT EXISTS idx_audit_log_user_hash ON audit_log(user_id, hash);
