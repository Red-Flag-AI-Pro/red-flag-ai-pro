alter table boundary_authorization_records
  add column if not exists affected_parties jsonb not null default '[]'::jsonb,
  add column if not exists impact_disclosed boolean not null default false;
