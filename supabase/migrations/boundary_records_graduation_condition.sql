alter table boundary_authorization_records
  add column if not exists graduation_condition text,
  add column if not exists graduation_owner_name text,
  add column if not exists graduation_owner_role text,
  add column if not exists graduation_triggered_at timestamptz;
