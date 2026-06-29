-- Add disposition columns to scan_flags for Sentinel sign-off feature
ALTER TABLE scan_flags
  ADD COLUMN IF NOT EXISTS disposition TEXT CHECK (disposition IN ('resolved', 'accepted_risk', 'not_applicable')),
  ADD COLUMN IF NOT EXISTS reviewed_by TEXT,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reviewer_note TEXT;
