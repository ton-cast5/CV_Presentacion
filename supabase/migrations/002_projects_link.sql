-- Add optional project URL/link
alter table public.projects
  add column if not exists link text not null default '';
