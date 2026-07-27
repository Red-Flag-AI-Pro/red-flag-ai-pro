-- Report orders table — tracks one-time PDF report purchases (e.g. The
-- Mystery of AI Governance, £9.99). Unlike audit_orders, delivery is instant
-- and self-serve via a signed Supabase Storage URL emailed by the webhook,
-- so status starts at 'delivered' rather than 'pending'.
create table if not exists report_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  stripe_session_id text unique not null,
  stripe_payment_intent text,
  amount_gbp numeric(10,2) not null default 9.99,
  report_slug text not null default 'mystery-of-ai-governance',
  status text not null default 'delivered',  -- delivered | delivery_failed
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS: users can see their own report orders; service role can see all
alter table report_orders enable row level security;

create policy "Users can view their own report orders"
  on report_orders for select
  using (auth.uid() = user_id);

-- Updated_at trigger
create or replace function update_report_orders_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger report_orders_updated_at
  before update on report_orders
  for each row execute function update_report_orders_updated_at();
