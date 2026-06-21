-- Automated audit log — forensic record of governance-relevant actions.
-- Sentinel feature: "Automated audit logging & forensic proof"

CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);

ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view their own audit log" ON audit_log;
CREATE POLICY "Users view their own audit log" ON audit_log
  FOR SELECT
  USING (user_id = auth.uid());

-- Inserts happen server-side only (service role / authenticated server actions),
-- so no INSERT policy for anon/authenticated — keeps the log tamper-resistant
-- from the client.
