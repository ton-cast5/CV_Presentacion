-- CV Presentacion — schema, RLS, storage, profile trigger

-- Enums
create type public.document_category as enum (
  'personal',
  'course',
  'dc3',
  'credential',
  'certification'
);

-- Profiles (1:1 with auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  slug text not null unique,
  nombre text not null default '',
  apellido text not null default '',
  foto_path text,
  sobre_mi text not null default '',
  perfil_profesional text not null default '',
  roles text[] not null default '{}',
  telefono text not null default '',
  email_contacto text not null default '',
  direccion text not null default '',
  fecha_nacimiento text not null default '',
  nacionalidad text not null default '',
  estado_civil text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_slug_idx on public.profiles (slug);

create table public.education (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  nivel text not null default '',
  institucion text not null default '',
  lugar text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.experience (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  puesto text not null default '',
  empresa text not null default '',
  fechas text not null default '',
  bullets text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  titulo text not null default '',
  descripcion text not null default '',
  fechas text not null default '',
  link text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.certifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  titulo text not null default '',
  emisor text not null default '',
  vigencia text not null default '',
  icono text not null default '▣',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  category public.document_category not null,
  nombre text not null default '',
  descripcion text not null default '',
  mime_type text not null default '',
  storage_path text not null,
  size bigint not null default 0,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index documents_profile_category_idx on public.documents (profile_id, category);

create table public.export_presets (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  nombre text not null default '',
  selection_json jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- Slug helper
create or replace function public.slugify(raw text)
returns text
language plpgsql
immutable
as $$
declare
  s text;
begin
  s := lower(coalesce(raw, ''));
  s := regexp_replace(s, '[áàäâ]', 'a', 'g');
  s := regexp_replace(s, '[éèëê]', 'e', 'g');
  s := regexp_replace(s, '[íìïî]', 'i', 'g');
  s := regexp_replace(s, '[óòöô]', 'o', 'g');
  s := regexp_replace(s, '[úùüû]', 'u', 'g');
  s := regexp_replace(s, 'ñ', 'n', 'g');
  s := regexp_replace(s, '[^a-z0-9]+', '-', 'g');
  s := trim(both '-' from s);
  if s = '' then
    s := 'usuario';
  end if;
  return s;
end;
$$;

create or replace function public.unique_slug(base text)
returns text
language plpgsql
as $$
declare
  candidate text := public.slugify(base);
  n int := 0;
begin
  while exists (select 1 from public.profiles where slug = candidate) loop
    n := n + 1;
    candidate := public.slugify(base) || '-' || n::text;
  end loop;
  return candidate;
end;
$$;

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  base_slug text;
  meta_nombre text;
  meta_apellido text;
begin
  meta_nombre := coalesce(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1));
  meta_apellido := coalesce(new.raw_user_meta_data->>'apellido', '');
  base_slug := coalesce(nullif(new.raw_user_meta_data->>'slug', ''), meta_nombre || '-' || meta_apellido);

  insert into public.profiles (id, slug, nombre, apellido, email_contacto)
  values (
    new.id,
    public.unique_slug(base_slug),
    meta_nombre,
    meta_apellido,
    coalesce(new.email, '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.education enable row level security;
alter table public.experience enable row level security;
alter table public.projects enable row level security;
alter table public.certifications enable row level security;
alter table public.documents enable row level security;
alter table public.export_presets enable row level security;

-- Profiles: public read, owner write
create policy "profiles_select_all"
  on public.profiles for select
  using (true);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Child tables: public read, owner CRUD
create policy "education_select_all" on public.education for select using (true);
create policy "education_insert_own" on public.education for insert with check (auth.uid() = profile_id);
create policy "education_update_own" on public.education for update using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
create policy "education_delete_own" on public.education for delete using (auth.uid() = profile_id);

create policy "experience_select_all" on public.experience for select using (true);
create policy "experience_insert_own" on public.experience for insert with check (auth.uid() = profile_id);
create policy "experience_update_own" on public.experience for update using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
create policy "experience_delete_own" on public.experience for delete using (auth.uid() = profile_id);

create policy "projects_select_all" on public.projects for select using (true);
create policy "projects_insert_own" on public.projects for insert with check (auth.uid() = profile_id);
create policy "projects_update_own" on public.projects for update using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
create policy "projects_delete_own" on public.projects for delete using (auth.uid() = profile_id);

create policy "certifications_select_all" on public.certifications for select using (true);
create policy "certifications_insert_own" on public.certifications for insert with check (auth.uid() = profile_id);
create policy "certifications_update_own" on public.certifications for update using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
create policy "certifications_delete_own" on public.certifications for delete using (auth.uid() = profile_id);

create policy "documents_select_all" on public.documents for select using (true);
create policy "documents_insert_own" on public.documents for insert with check (auth.uid() = profile_id);
create policy "documents_update_own" on public.documents for update using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
create policy "documents_delete_own" on public.documents for delete using (auth.uid() = profile_id);

create policy "export_presets_select_own" on public.export_presets for select using (auth.uid() = profile_id);
create policy "export_presets_insert_own" on public.export_presets for insert with check (auth.uid() = profile_id);
create policy "export_presets_update_own" on public.export_presets for update using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
create policy "export_presets_delete_own" on public.export_presets for delete using (auth.uid() = profile_id);

-- Storage buckets
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do nothing;

-- Avatars: anyone can read; owner can write under their folder
create policy "avatars_public_read"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "avatars_owner_insert"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars_owner_update"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "avatars_owner_delete"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Documents: public read (public CV); owner write
create policy "documents_public_read"
  on storage.objects for select
  using (bucket_id = 'documents');

create policy "documents_owner_insert"
  on storage.objects for insert
  with check (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "documents_owner_update"
  on storage.objects for update
  using (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "documents_owner_delete"
  on storage.objects for delete
  using (
    bucket_id = 'documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
