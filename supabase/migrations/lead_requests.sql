-- Every request a visitor makes for us to do something for them: a free site
-- check, a done for you audit, a Sentinel enquiry. One table, full details.
--
-- Before this, audit and Sentinel requests were only ever emailed, never
-- stored, so when email sending went down they were lost. This table is the
-- record of truth; email and anything else is a notification on top of it.

CREATE TABLE IF NOT EXISTS lead_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- 'site-check' | 'audit' | 'sentinel'
  kind TEXT NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  company TEXT,
  website TEXT,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Set by hand once James has replied, so the daily check can show what is
  -- still waiting.
  handled_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_lead_requests_created_at ON lead_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_requests_kind ON lead_requests(kind);

ALTER TABLE lead_requests ENABLE ROW LEVEL SECURITY;

-- No public policies. All access goes through the service role from the
-- request API routes.
