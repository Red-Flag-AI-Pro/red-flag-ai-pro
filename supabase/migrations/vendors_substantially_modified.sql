-- A vendor assessed once at onboarding can change materially afterward — a
-- new model version, a new subprocessor, a new data flow — without anything
-- in the tracker reflecting it. Under the EU AI Act, a "substantial
-- modification" to a system can trigger re-classification obligations that
-- the original assessment never covered. This column makes that a fact to
-- record, not something inferred from a stale risk_level nobody revisited.

ALTER TABLE vendors ADD COLUMN IF NOT EXISTS substantially_modified boolean NOT NULL DEFAULT false;
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS substantially_modified_notes text;
