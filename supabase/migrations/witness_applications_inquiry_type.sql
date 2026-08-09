-- Task #261, 9 Aug 2026: the installable Witness Node dashboard needs a lead
-- capture form too. Reusing witness_applications rather than a new table --
-- an install-node inquiry is still, at heart, an application to become a
-- real chain peer, just via a different route than the raw API.
alter table public.witness_applications
  add column if not exists inquiry_type text not null default 'peer_application';
