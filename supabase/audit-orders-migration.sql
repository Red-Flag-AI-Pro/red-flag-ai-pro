-- Audit orders table — tracks one-time done-for-you audit purchases
create table if not exists audit_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  stripe_session_id text unique not null,
  stripe_payment_intent text,
  amount_gbp integer not null default 97,
  status text not null default 'pending',  -- pending | paid | delivered | cancelled
  url_submitted text,                       -- populated when customer emails their URL
  delivered_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS: users can see their own orders; service role can see all
alter table audit_orders enable row level security;

create policy "Users can view their own audit orders"
  on audit_orders for select
  using (auth.uid() = user_id);

-- Updated_at trigger
create or replace function update_audit_orders_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger audit_orders_updated_at
  before update on audit_orders
  for each row execute function update_audit_orders_updated_at();
