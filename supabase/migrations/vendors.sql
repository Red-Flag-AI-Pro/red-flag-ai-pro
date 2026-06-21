-- Vendor AI Risk Tracker
-- Lets Pro/Sentinel users log and track third-party AI vendors/tools and their risk status.

CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organisation_id UUID,

  name TEXT NOT NULL,
  purpose TEXT,
  data_shared TEXT,
  risk_level TEXT NOT NULL DEFAULT 'unassessed' CHECK (risk_level IN ('unassessed', 'low', 'medium', 'high')),
  contract_reviewed BOOLEAN NOT NULL DEFAULT false,
  last_reviewed_at DATE,
  next_review_due DATE,
  notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vendors_user_id ON vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_vendors_organisation_id ON vendors(organisation_id);

CREATE OR REPLACE FUNCTION update_vendors_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS vendors_updated_at_trigger ON vendors;
CREATE TRIGGER vendors_updated_at_trigger
BEFORE UPDATE ON vendors
FOR EACH ROW
EXECUTE FUNCTION update_vendors_updated_at();

ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage their own vendors" ON vendors;
CREATE POLICY "Users manage their own vendors" ON vendors
  FOR ALL
  USING (
    user_id = auth.uid()
    OR (
      organisation_id IS NOT NULL
      AND organisation_id IN (
        SELECT organisation_id FROM profiles WHERE user_id = auth.uid()
      )
    )
  )
  WITH CHECK (user_id = auth.uid());
