-- Jabber Khan sample deliverable, 9 Aug 2026: his Part 2 has a numbered risk
-- register, ID/likelihood/impact/mitigation. The £497 program had nothing
-- like it. Stored the same way regulatory_mapping already is, computed once
-- at generation time and saved, not recomputed on every page load.
alter table program_orders
  add column if not exists risk_register jsonb;
