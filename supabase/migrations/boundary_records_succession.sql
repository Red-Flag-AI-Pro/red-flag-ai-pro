-- Links a new boundary authorization record to the one it supersedes, so a
-- change of role holder is a provable chain of custody, not an isolated
-- record that silently starts a new clock.
alter table boundary_authorization_records
  add column if not exists supersedes_id uuid references boundary_authorization_records(id) on delete set null;

create index if not exists idx_boundary_records_supersedes on boundary_authorization_records(supersedes_id);
