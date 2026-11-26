-- The sales console: firms James approaches first, with the red flag found on
-- their site, what has been sent, and what happens next. Inbound requests
-- from the website live in lead_requests; a request can be turned into a
-- prospect here so both are worked from one list.

CREATE TABLE IF NOT EXISTS prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  company TEXT NOT NULL,
  website TEXT,
  sector TEXT,
  -- Where the lead came from: 'outbound', 'asa-ruling', 'competitor',
  -- 'referral', 'inbound'.
  source TEXT,

  contact_name TEXT,
  contact_role TEXT,
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  postal_address TEXT,

  -- The red flag: what their site says, where, why it is a problem, the rule.
  red_flag_quote TEXT,
  red_flag_where TEXT,
  red_flag_problem TEXT,
  red_flag_rule TEXT,
  more_count INTEGER,

  -- 'new' | 'contacted' | 'replied' | 'flag_sent' | 'audit_sold' | 'lost'
  stage TEXT NOT NULL DEFAULT 'new',
  next_action TEXT,
  next_action_at DATE,

  -- UK rules: a sales call needs the number checked against the TPS and CTPS
  -- registers first. The console will not offer a call until this is filled.
  tps_checked_at TIMESTAMP WITH TIME ZONE,
  tps_registered BOOLEAN,
  do_not_contact BOOLEAN NOT NULL DEFAULT FALSE,

  notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_prospects_stage ON prospects(stage);
CREATE INDEX IF NOT EXISTS idx_prospects_next_action_at ON prospects(next_action_at);

CREATE TABLE IF NOT EXISTS prospect_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id UUID NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  -- 'linkedin' | 'letter' | 'call' | 'email' | 'note' | 'stage'
  kind TEXT NOT NULL,
  outcome TEXT,
  detail TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_prospect_activity_prospect ON prospect_activity(prospect_id, created_at DESC);

ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE prospect_activity ENABLE ROW LEVEL SECURITY;

-- No public policies. All access goes through the service role from the
-- /api/console routes, which only answer to the admin login.
