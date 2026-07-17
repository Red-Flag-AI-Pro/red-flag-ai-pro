-- Create boundary_authorization_records table
-- A structured decision log for AI tool/system approvals: what was decided,
-- who owns it, what was considered, what risk was knowingly accepted, and
-- what evidence backs it. Sentinel-only, following the governance_assessments
-- and audit_log patterns already in this codebase.

CREATE TABLE IF NOT EXISTS boundary_authorization_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  decision TEXT NOT NULL,
  owner_name TEXT NOT NULL,
  owner_role TEXT NOT NULL,

  -- Each: { "label": "..." } — options weighed and, where relevant, why rejected.
  options_considered JSONB NOT NULL DEFAULT '[]',

  -- Each: { "risk": "...", "mitigation": "..." } — accepted risk and how it's controlled.
  risks_accepted JSONB NOT NULL DEFAULT '[]',

  -- Each: { "label": "..." } — DPIA, DPA, security assessment, vendor comparison, etc.
  evidence JSONB NOT NULL DEFAULT '[]',

  decision_date DATE NOT NULL,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_boundary_records_user_id ON boundary_authorization_records(user_id);
CREATE INDEX IF NOT EXISTS idx_boundary_records_created_at ON boundary_authorization_records(created_at DESC);

CREATE OR REPLACE FUNCTION update_boundary_records_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER boundary_records_updated_at_trigger
BEFORE UPDATE ON boundary_authorization_records
FOR EACH ROW
EXECUTE FUNCTION update_boundary_records_updated_at();

ALTER TABLE boundary_authorization_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own boundary records" ON boundary_authorization_records
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own boundary records" ON boundary_authorization_records
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own boundary records" ON boundary_authorization_records
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
