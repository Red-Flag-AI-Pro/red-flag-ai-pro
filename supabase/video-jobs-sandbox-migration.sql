-- Add Vercel Sandbox render tracking columns to video_jobs
-- Run in Supabase SQL Editor

alter table public.video_jobs
  add column if not exists sandbox_id text,
  add column if not exists cmd_id text;
