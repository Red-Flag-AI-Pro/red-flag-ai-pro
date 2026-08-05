-- Links each £297 Full Governance Program order to the boundary authorization
-- record created alongside it (task #243), so the delivery page can link
-- straight to it and the pipeline never creates a duplicate on regeneration.
alter table program_orders
  add column if not exists boundary_record_id uuid references boundary_authorization_records(id);
