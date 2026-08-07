-- GDPR Article 17 tombstoning for the audit log.
-- A hash-chained log cannot delete a row without breaking every entry after
-- it, so erasure works by redacting the row's content in place while
-- freezing its hash and prev_hash at their original values. That leaves a
-- recomputed-hash mismatch on this one row by design, which verifyAuditChain
-- treats as an expected, documented redaction rather than tampering, as long
-- as these columns are set.

ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS redacted_at TIMESTAMPTZ;
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS redaction_reason TEXT;
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS redacted_by TEXT;

CREATE INDEX IF NOT EXISTS idx_audit_log_redacted ON audit_log(user_id) WHERE redacted_at IS NOT NULL;
