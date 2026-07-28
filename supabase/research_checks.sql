-- Internal research dataset: real companies checked for the "state of UK
-- compliance and AI governance" study. NOT user facing, no public policies.
-- Every row is visible to James by name so he can personally decide whether
-- something is postable. The has_public_ruling flag is the single gate for
-- ever naming a company publicly: true only when there is an existing,
-- independent regulatory finding (ASA/CMA/etc) behind it, never based on
-- our own check alone.

create table if not exists public.research_checks (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('compliance', 'governance_visibility')),
  company_name text not null,
  domain text not null,
  source_url text not null,

  -- Compliance checks: 0 to 100, same scoring as the live product.
  -- Governance visibility checks: left null, signals carry the detail instead.
  score integer,

  -- Compliance: [{category, severity, excerpt}]. Governance visibility:
  -- [{dimension, signal, found: true/false, evidence_url}].
  flags jsonb not null default '[]',

  -- Only set true when a real, already public regulatory ruling exists
  -- against this company (ASA, CMA, etc). This is the only thing that makes
  -- a row safe to name publicly; everything else is aggregate-only.
  has_public_ruling boolean not null default false,
  ruling_source_url text,

  checked_at timestamptz not null default now(),
  notes text
);

create index if not exists idx_research_checks_kind on public.research_checks (kind);
create index if not exists idx_research_checks_public_ruling on public.research_checks (has_public_ruling) where has_public_ruling = true;

alter table public.research_checks enable row level security;
-- No public policies: this table is written and read only via the service
-- role, from internal scripts. It is not part of the live product.
