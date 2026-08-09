-- Task #288, 9 Aug 2026. Evelyne-Claudia Y., LinkedIn: can a broken/
-- unaddressed claim independently affect what a bundled headline status
-- carries forward, or does it just get displayed underneath an unaffected
-- grade? Checked honestly: previously the letter grade never looked at gap
-- status at all. A completely unaddressed regulatory document (not a
-- partial answer) now caps the grade at C, and these columns record when
-- that ceiling actually applied so the delivery page can say so plainly
-- rather than a customer just seeing a lower letter with no explanation.
alter table public.program_orders
  add column if not exists letter_grade_capped boolean not null default false,
  add column if not exists letter_grade_not_started_count integer not null default 0;
