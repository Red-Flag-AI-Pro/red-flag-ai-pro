-- Kamilla Harcej, LinkedIn 9 Aug 2026: "Approval records evidence. Governance
-- controls execution." Correct about most compliance tooling, including most
-- of what's here. The one piece that pushes back on it, the Real Time Gate,
-- still had no visible link to the boundary authorization record that
-- actually governs the key doing the blocking -- a blocked decision and the
-- named, dated approval behind it were two unconnected things.
--
-- Denormalized rather than a live join: these three columns freeze what the
-- governing record said at the moment of the block, not what it says today.
-- A boundary record can be edited later; the evidence of what governed a
-- specific past decision should not silently change underneath it.
alter table enforcement_decisions
  add column if not exists governing_record_id uuid references boundary_authorization_records(id) on delete set null,
  add column if not exists governing_record_decision text,
  add column if not exists governing_record_owner_name text;
