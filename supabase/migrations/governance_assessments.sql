-- Create governance_assessments table
-- Account-linked governance audit results (Sentinel plan), with a trackable
-- remediation roadmap — unlike governance_audit_emails (anonymous lead-gen),
-- these are tied to a user_id so the roadmap can be managed over time.

CREATE TABLE IF NOT EXISTS governance_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  risk_level TEXT NOT NULL CHECK (risk_level IN ('critical', 'moderate', 'managed', 'mature')),

  dimension_scores JSONB NOT NULL DEFAULT '{}',
  red_flags JSONB NOT NULL DEFAULT '[]',

  -- Roadmap actions, each with a stable id and a mutable status:
  -- [{ "id": "...", "phase": "...", "title": "...", ..., "status": "not_started" | "in_progress" | "done" }]
  roadmap JSONB NOT NULL DEFAULT '[]',

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_governance_assessments_user_id ON governance_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_governance_assessments_created_at ON governance_assessments(created_at DESC);

CREATE OR REPLACE FUNCTION update_governance_assessments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER governance_assessments_updated_at_trigger
BEFORE UPDATE ON governance_assessments
FOR EACH ROW
EXECUTE FUNCTION update_governance_assessments_updated_at();

ALTER TABLE governance_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own governance assessments" ON governance_assessments
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own governance assessments" ON governance_assessments
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own governance assessments" ON governance_assessments
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
