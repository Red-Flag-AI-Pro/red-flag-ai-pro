-- Add role and mandate columns to scan_flags for accountability sign-off
-- reviewer_role: the formal governance role held by the signer (e.g. DPO, CRO, Legal Counsel)
-- reviewer_mandate: the authority basis for the decision (e.g. Authorised by Board resolution 2026-06-30)
ALTER TABLE scan_flags
  ADD COLUMN IF NOT EXISTS reviewer_role TEXT,
  ADD COLUMN IF NOT EXISTS reviewer_mandate TEXT;
