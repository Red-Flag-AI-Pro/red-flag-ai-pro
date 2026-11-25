-- Law date alerts: people who asked for one email before each date in
-- src/lib/law-timeline.ts takes effect. Alert only, by design: these
-- addresses are NOT added to the general marketing list, because that is not
-- what the form asks consent for.

CREATE TABLE IF NOT EXISTS law_alert_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  -- Random token for the one click unsubscribe link, so the link never
  -- carries the email address itself.
  token UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_law_alert_subscribers_token ON law_alert_subscribers(token);

-- One row per timeline event once its alert has gone out, so the daily job
-- can never send the same date twice.
CREATE TABLE IF NOT EXISTS law_alert_sends (
  event_key TEXT PRIMARY KEY,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  recipients INTEGER NOT NULL DEFAULT 0
);

ALTER TABLE law_alert_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE law_alert_sends ENABLE ROW LEVEL SECURITY;

-- No public policies. All access goes through the service role from the
-- /api/law-alerts routes and the daily cron.
