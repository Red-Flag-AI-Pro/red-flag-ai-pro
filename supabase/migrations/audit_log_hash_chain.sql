-- Cryptographic hash chain for the audit log.
-- Each entry's hash covers its own data plus the previous entry's hash, so
-- altering or deleting any past row breaks the chain from that point on —
-- this is what makes "tamper-resistant" a verifiable claim, not a label.

ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS prev_hash TEXT;
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS hash TEXT;

CREATE INDEX IF NOT EXISTS idx_audit_log_user_created ON audit_log(user_id, created_at ASC);
