alter table boundary_authorization_records
  add column if not exists reasoning_recorded boolean not null default false;

update boundary_authorization_records
set reasoning_recorded = true
where jsonb_array_length(coalesce(evidence, '[]'::jsonb)) > 0
   or jsonb_array_length(coalesce(options_considered, '[]'::jsonb)) > 0
   or jsonb_array_length(coalesce(risks_accepted, '[]'::jsonb)) > 0;
