-- Video render jobs — Run in Supabase SQL Editor

-- 1. Jobs table
create table if not exists public.video_jobs (
  id          uuid primary key default gen_random_uuid(),
  scan_id     uuid references public.scans(id) on delete cascade not null,
  user_id     uuid references auth.users(id) on delete cascade not null,
  status      text not null default 'pending' check (status in ('pending', 'processing', 'complete', 'error')),
  video_url   text,
  error       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.video_jobs enable row level security;

create policy "Users can manage own video jobs"
  on public.video_jobs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 2. Storage bucket for rendered videos (public read so download links work)
insert into storage.buckets (id, name, public)
values ('scan-videos', 'scan-videos', true)
on conflict (id) do nothing;

create policy "Users can upload own scan videos"
  on storage.objects for insert
  with check (
    bucket_id = 'scan-videos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Anyone can read scan videos"
  on storage.objects for select
  using (bucket_id = 'scan-videos');
