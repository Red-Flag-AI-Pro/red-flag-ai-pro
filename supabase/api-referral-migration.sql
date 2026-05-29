-- API Keys, Webhooks, Referrals — Run in Supabase SQL Editor

-- 1. API keys table
create table if not exists public.api_keys (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null,
  key_hash    text not null unique,
  key_prefix  text not null,
  created_at  timestamptz not null default now(),
  last_used_at timestamptz
);

alter table public.api_keys enable row level security;

drop policy if exists "Users manage own api keys" on public.api_keys;
create policy "Users manage own api keys"
  on public.api_keys for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 2. Webhook URL on profiles
alter table public.profiles
  add column if not exists webhook_url text;

-- 3. Referral codes on profiles
alter table public.profiles
  add column if not exists referral_code text unique
    default upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 8));

alter table public.profiles
  add column if not exists referred_by text;
