-- Task #277, 9 Aug 2026. Jabber Khan sample deliverable: his roadmap
-- sequences work into phases (now to 8 weeks, 8 to 16 weeks, etc.) tied to
-- the actual regulatory deadline. The £497 program stated deadlines but
-- never sequenced the six documents' work against them. Phases are bucketed
-- from the regulatory mapping's own gap status (see program-timeline.ts),
-- never invented, plus the real EU AI Act deadlines when the customer's
-- primary jurisdiction is the EU.
alter table public.program_orders
  add column if not exists timeline jsonb;
