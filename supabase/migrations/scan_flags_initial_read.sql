-- Commit before reveal: the reviewer's own read of a flag, recorded BEFORE
-- the AI's reasoning is shown to them. Sealed as its own audit event at the
-- moment of commit, so the record proves the human judgment existed prior to
-- seeing the machine's, not alongside or after it.
alter table scan_flags
  add column if not exists initial_read text
    check (initial_read in ('real_issue', 'unsure', 'not_applicable')),
  add column if not exists initial_read_note text,
  add column if not exists initial_read_at timestamptz;
