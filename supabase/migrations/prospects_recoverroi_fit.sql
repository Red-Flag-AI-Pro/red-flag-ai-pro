-- A prospect can also be a fit for James's other business, RecoverROI (lost
-- enquiries, websites, front desk). The tick is a reminder of who to go back
-- to, and the note records what was noticed while checking their site. It is
-- only ever raised with the prospect in a conversation already under way.

ALTER TABLE prospects ADD COLUMN IF NOT EXISTS recoverroi_fit BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS recoverroi_note TEXT;
