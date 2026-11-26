-- How serious the rest of a prospect's red flags are, in one sentence, for
-- the reply when they answer. Says how serious, never what or where: the
-- detail is what the paid audit sells.
ALTER TABLE prospects ADD COLUMN IF NOT EXISTS reply_summary TEXT;
