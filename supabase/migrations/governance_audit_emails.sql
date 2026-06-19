-- Create governance_audit_emails table
-- Email-gated governance audit quiz results
-- One assessment per email address (unique constraint enforced)

CREATE TABLE IF NOT EXISTS governance_audit_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  risk_level TEXT NOT NULL CHECK (risk_level IN ('critical', 'moderate', 'managed', 'mature')),

  -- Dimension scores (0-30 each)
  dimension_scores JSONB NOT NULL DEFAULT '{}',
  -- {
  --   "strategy_ownership": 15,
  --   "tool_data_governance": 20,
  --   "policy_documentation": 10,
  --   "monitoring_accountability": 25,
  --   "vendor_risk": 18,
  --   "regulatory_readiness": 22
  -- }

  -- Red flags (array of flag objects)
  red_flags JSONB NOT NULL DEFAULT '[]',
  -- [
  --   {
  --     "severity": "high",
  --     "dimension": "strategy_ownership",
  --     "title": "...",
  --     "description": "...",
  --     "recommendation": "...",
  --     "regulatoryContext": [...]
  --   },
  --   ...
  -- ]

  -- Answers (for record-keeping)
  answers JSONB NOT NULL DEFAULT '[]',
  -- [
  --   {
  --     "questionId": "strat_1",
  --     "dimension": "strategy_ownership",
  --     "value": "...",
  --     "riskPoints": 3
  --   },
  --   ...
  -- ]

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_governance_audit_emails_email ON governance_audit_emails(email);
CREATE INDEX IF NOT EXISTS idx_governance_audit_emails_created_at ON governance_audit_emails(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_governance_audit_emails_risk_level ON governance_audit_emails(risk_level);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_governance_audit_emails_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER governance_audit_emails_updated_at_trigger
BEFORE UPDATE ON governance_audit_emails
FOR EACH ROW
EXECUTE FUNCTION update_governance_audit_emails_updated_at();

-- RLS: Enable RLS (no authentication required; anyone can submit)
ALTER TABLE governance_audit_emails ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Anyone can insert their own email (public submission)
CREATE POLICY "Allow public submission" ON governance_audit_emails
  FOR INSERT TO anon
  WITH CHECK (true);

-- RLS Policy: Anyone can view their own results (optional; currently not needed for this MVP)
-- (Results are returned immediately after submission, so no need to fetch from table)
