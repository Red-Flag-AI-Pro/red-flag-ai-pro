-- Captures leads from the free, ungated tools (Fine Calculator, Compliance
-- Checklist, Disclosure Generator). One row per email+tool use — visitors can
-- use the tool again later from the same browser without re-entering email
-- (handled client-side via localStorage), but every first use is logged here.

CREATE TABLE IF NOT EXISTS tool_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  tool TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tool_leads_email ON tool_leads(email);
CREATE INDEX IF NOT EXISTS idx_tool_leads_tool ON tool_leads(tool);
CREATE INDEX IF NOT EXISTS idx_tool_leads_created_at ON tool_leads(created_at DESC);

ALTER TABLE tool_leads ENABLE ROW LEVEL SECURITY;

-- No public SELECT/INSERT policy — all access goes through the service role
-- from the /api/tool-leads route.
