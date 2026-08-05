-- The £497 Full Governance Program tier: one-off, Sentinel-equivalent bundle.
-- Stores the shared intake (asked once, feeds all six documents) plus every
-- generated artifact, so the delivery page can be reloaded/re-verified later
-- without regenerating anything.
create table if not exists program_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  email text not null,
  stripe_session_id text,
  stripe_payment_intent text,
  amount_gbp numeric,
  status text not null default 'pending', -- pending | generating | delivered | error

  -- Shared intake, asked once, mapped into every document below.
  intake jsonb not null default '{}'::jsonb,

  -- Linked audit (the £199 audit this program includes), if the customer has one.
  audit_id uuid,

  -- Generated artifacts.
  dpia jsonb,
  fria jsonb,
  ai_use_policy jsonb,
  incident_checklist jsonb,
  monitoring_plan jsonb,
  documentation jsonb,

  financial_snapshot jsonb,
  regulatory_mapping jsonb,
  letter_grade text, -- 'A' through 'G'
  letter_grade_score integer,

  -- Sealing (task #240): once complete, the whole bundle is sealed as one
  -- dated, verifiable event via the existing admin seal-document endpoint.
  seal_id uuid,
  seal_content_sha256 text,
  sealed_at timestamptz,

  created_at timestamptz not null default now(),
  delivered_at timestamptz
);

alter table program_orders enable row level security;

create policy "users can view their own program orders" on program_orders
  for select using (auth.uid() = user_id);

-- No insert/update policy for anon/authenticated: all writes happen via the
-- service role from the webhook and generation pipeline, never from the client.
