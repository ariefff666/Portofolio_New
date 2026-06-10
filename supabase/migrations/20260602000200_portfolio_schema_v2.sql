-- Standalone portfolio CMS schema V2.
-- Run this file for a fresh setup. Do not run the archived V1 migration first.
-- Every application-owned table uses a singular name without an "s" suffix.
-- Plural names in auth and storage schemas are Supabase-owned tables.

create schema if not exists private;
revoke all on schema private from public;

create type public.status_konten as enum ('draf', 'terbit', 'arsip');
create type public.status_komentar as enum ('menunggu', 'terbit', 'tolak', 'sembunyi', 'spam');
create type public.status_transmisi as enum ('baru', 'dibaca', 'dibalas', 'arsip', 'spam');
create type public.tipe_riset as enum (
  'eksperimen',
  'catatan',
  'dataset',
  'evaluasi-model',
  'metodologi',
  'milestone'
);
create type public.tahap_publikasi as enum (
  'terbit',
  'preprint',
  'ditinjau',
  'berjalan',
  'draf',
  'catatan-baca'
);

create table public.admin (
  id uuid primary key references auth.users(id) on delete cascade,
  nama text not null,
  peran text not null default 'admin' check (peran in ('admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profil (
  id uuid primary key default gen_random_uuid(),
  kode text not null unique default 'utama' check (kode = 'utama'),
  nama text not null,
  headline text not null,
  tagline text,
  ringkasan text not null,
  misi text,
  universitas text,
  program_studi text,
  lokasi text,
  email_publik text,
  availability text,
  tautan jsonb not null default '{}'::jsonb check (jsonb_typeof(tautan) = 'object'),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.metrik (
  id uuid primary key default gen_random_uuid(),
  kode text not null unique,
  label text not null,
  nilai text not null,
  unit text,
  urutan integer not null default 0,
  aktif boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pengaturan (
  kunci text primary key,
  nilai jsonb not null,
  publik boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.media (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'portofolio',
  path text not null unique,
  alt_text text,
  mime_type text,
  ukuran_byte bigint check (ukuran_byte is null or ukuran_byte >= 0),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  aktif boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.kategori_proyek (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nama text not null,
  deskripsi text,
  urutan integer not null default 0,
  aktif boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tag (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nama text not null,
  jenis text,
  warna text,
  aktif boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.kelompok_keahlian (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nama text not null,
  deskripsi text,
  urutan integer not null default 0,
  aktif boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.keahlian (
  id uuid primary key default gen_random_uuid(),
  kelompok_keahlian_id uuid references public.kelompok_keahlian(id) on delete set null,
  slug text not null unique,
  nama text not null,
  deskripsi text,
  ikon_url text,
  warna text,
  tingkat text,
  urutan integer not null default 0,
  aktif boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.proyek (
  id uuid primary key default gen_random_uuid(),
  kategori_proyek_id uuid references public.kategori_proyek(id) on delete set null,
  cover_media_id uuid references public.media(id) on delete set null,
  slug text not null unique,
  judul text not null,
  ringkasan text not null,
  masalah text,
  solusi text,
  peran text,
  konten text,
  dampak text,
  status public.status_konten not null default 'draf',
  unggulan boolean not null default false,
  urutan integer not null default 0,
  repository_url text,
  demo_url text,
  tanggal_mulai date,
  tanggal_selesai date,
  tahun smallint check (tahun is null or tahun between 2000 and 2100),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.gambar_proyek (
  id uuid primary key default gen_random_uuid(),
  proyek_id uuid not null references public.proyek(id) on delete cascade,
  media_id uuid references public.media(id) on delete set null,
  url text,
  alt_text text not null,
  caption text,
  urutan integer not null default 0,
  aktif boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (media_id is not null or url is not null)
);

create table public.proyek_tag (
  proyek_id uuid not null references public.proyek(id) on delete cascade,
  tag_id uuid not null references public.tag(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (proyek_id, tag_id)
);

create table public.proyek_keahlian (
  proyek_id uuid not null references public.proyek(id) on delete cascade,
  keahlian_id uuid not null references public.keahlian(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (proyek_id, keahlian_id)
);

create table public.area_riset (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nama text not null,
  deskripsi text,
  urutan integer not null default 0,
  aktif boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.riset (
  id uuid primary key default gen_random_uuid(),
  cover_media_id uuid references public.media(id) on delete set null,
  slug text not null unique,
  judul text not null,
  tipe public.tipe_riset not null default 'eksperimen',
  ringkasan text not null,
  tujuan text,
  metode text,
  dataset text,
  hasil text,
  konten text,
  status public.status_konten not null default 'draf',
  unggulan boolean not null default false,
  urutan integer not null default 0,
  repository_url text,
  demo_url text,
  paper_url text,
  tanggal_mulai date,
  tanggal_selesai date,
  metrik jsonb not null default '[]'::jsonb check (jsonb_typeof(metrik) = 'array'),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.riset_area (
  riset_id uuid not null references public.riset(id) on delete cascade,
  area_riset_id uuid not null references public.area_riset(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (riset_id, area_riset_id)
);

create table public.catatan_riset (
  id uuid primary key default gen_random_uuid(),
  riset_id uuid references public.riset(id) on delete set null,
  slug text not null unique,
  judul text not null,
  tipe text not null default 'log',
  ringkasan text not null,
  konten text,
  status public.status_konten not null default 'draf',
  unggulan boolean not null default false,
  urutan integer not null default 0,
  tanggal date,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.riset_tag (
  riset_id uuid not null references public.riset(id) on delete cascade,
  tag_id uuid not null references public.tag(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (riset_id, tag_id)
);

create table public.riset_keahlian (
  riset_id uuid not null references public.riset(id) on delete cascade,
  keahlian_id uuid not null references public.keahlian(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (riset_id, keahlian_id)
);

create table public.publikasi (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  judul text not null,
  abstrak text,
  tipe text not null default 'paper',
  tahap public.tahap_publikasi not null default 'draf',
  status public.status_konten not null default 'draf',
  venue text,
  doi text,
  arxiv_url text,
  url text,
  target text,
  tanggal_terbit date,
  unggulan boolean not null default false,
  urutan integer not null default 0,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pengarang (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  orcid text,
  url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.publikasi_pengarang (
  publikasi_id uuid not null references public.publikasi(id) on delete cascade,
  pengarang_id uuid not null references public.pengarang(id) on delete restrict,
  urutan integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (publikasi_id, pengarang_id)
);

create table public.publikasi_tag (
  publikasi_id uuid not null references public.publikasi(id) on delete cascade,
  tag_id uuid not null references public.tag(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (publikasi_id, tag_id)
);

create table public.organisasi (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nama text not null,
  tipe text,
  deskripsi text,
  lokasi text,
  url text,
  logo_media_id uuid references public.media(id) on delete set null,
  urutan integer not null default 0,
  aktif boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pengalaman (
  id uuid primary key default gen_random_uuid(),
  organisasi_id uuid references public.organisasi(id) on delete set null,
  slug text not null unique,
  judul text not null,
  tipe text not null,
  ringkasan text not null,
  konten text,
  lokasi text,
  tanggal_mulai date,
  tanggal_selesai date,
  status public.status_konten not null default 'draf',
  unggulan boolean not null default false,
  urutan integer not null default 0,
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pengalaman_tag (
  pengalaman_id uuid not null references public.pengalaman(id) on delete cascade,
  tag_id uuid not null references public.tag(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (pengalaman_id, tag_id)
);

create table public.komentar (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.komentar(id) on delete set null,
  nama text not null check (char_length(nama) between 2 and 80),
  isi text not null check (char_length(isi) between 2 and 1000),
  status public.status_komentar not null default 'menunggu',
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.moderasi_komentar (
  komentar_id uuid primary key references public.komentar(id) on delete cascade,
  email_hash text,
  ip_hash text,
  user_agent text,
  alasan text,
  ditinjau_oleh uuid references auth.users(id) on delete set null,
  ditinjau_pada timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.transmisi (
  id uuid primary key default gen_random_uuid(),
  nama_pengirim text not null check (char_length(nama_pengirim) between 2 and 80),
  email_pengirim text not null,
  subjek text not null check (char_length(subjek) between 2 and 160),
  pesan text not null check (char_length(pesan) between 2 and 5000),
  status public.status_transmisi not null default 'baru',
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index metrik_aktif_urutan_idx on public.metrik (aktif, urutan);
create index media_aktif_idx on public.media (aktif);
create index kategori_proyek_aktif_urutan_idx on public.kategori_proyek (aktif, urutan);
create index tag_aktif_jenis_idx on public.tag (aktif, jenis);
create index kelompok_keahlian_aktif_urutan_idx on public.kelompok_keahlian (aktif, urutan);
create index keahlian_kelompok_aktif_urutan_idx on public.keahlian (kelompok_keahlian_id, aktif, urutan);
create index proyek_status_unggulan_urutan_idx on public.proyek (status, unggulan, urutan);
create index proyek_kategori_idx on public.proyek (kategori_proyek_id);
create index gambar_proyek_proyek_urutan_idx on public.gambar_proyek (proyek_id, aktif, urutan);
create index proyek_tag_tag_idx on public.proyek_tag (tag_id);
create index proyek_keahlian_keahlian_idx on public.proyek_keahlian (keahlian_id);
create index area_riset_aktif_urutan_idx on public.area_riset (aktif, urutan);
create index riset_status_tipe_urutan_idx on public.riset (status, tipe, urutan);
create index riset_area_area_idx on public.riset_area (area_riset_id);
create index catatan_riset_riset_status_idx on public.catatan_riset (riset_id, status, tanggal desc);
create index riset_tag_tag_idx on public.riset_tag (tag_id);
create index riset_keahlian_keahlian_idx on public.riset_keahlian (keahlian_id);
create index publikasi_status_tahap_urutan_idx on public.publikasi (status, tahap, urutan);
create index publikasi_pengarang_pengarang_idx on public.publikasi_pengarang (pengarang_id);
create index publikasi_tag_tag_idx on public.publikasi_tag (tag_id);
create index organisasi_aktif_urutan_idx on public.organisasi (aktif, urutan);
create index pengalaman_status_urutan_idx on public.pengalaman (status, urutan);
create index pengalaman_organisasi_idx on public.pengalaman (organisasi_id);
create index pengalaman_tag_tag_idx on public.pengalaman_tag (tag_id);
create index komentar_status_created_idx on public.komentar (status, created_at desc);
create index transmisi_status_created_idx on public.transmisi (status, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin
    where id = (select auth.uid())
  );
$$;

revoke all on function private.is_admin() from public;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

do $$
declare
  nama_tabel text;
begin
  foreach nama_tabel in array array[
    'admin', 'profil', 'metrik', 'pengaturan', 'media',
    'kategori_proyek', 'tag', 'kelompok_keahlian', 'keahlian',
    'proyek', 'gambar_proyek', 'proyek_tag', 'proyek_keahlian',
    'area_riset', 'riset', 'riset_area', 'catatan_riset', 'riset_tag', 'riset_keahlian',
    'publikasi', 'pengarang', 'publikasi_pengarang', 'publikasi_tag',
    'organisasi', 'pengalaman', 'pengalaman_tag',
    'komentar', 'moderasi_komentar', 'transmisi'
  ]
  loop
    execute format('alter table public.%I enable row level security', nama_tabel);
    execute format(
      'create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()',
      nama_tabel
    );
  end loop;
end;
$$;

create policy "profil dapat dibaca publik"
on public.profil for select to anon, authenticated
using (true);

create policy "metrik aktif dapat dibaca publik"
on public.metrik for select to anon, authenticated
using (aktif);

create policy "pengaturan publik dapat dibaca publik"
on public.pengaturan for select to anon, authenticated
using (publik);

create policy "media aktif dapat dibaca publik"
on public.media for select to anon, authenticated
using (aktif);

create policy "kategori proyek aktif dapat dibaca publik"
on public.kategori_proyek for select to anon, authenticated
using (aktif);

create policy "tag aktif dapat dibaca publik"
on public.tag for select to anon, authenticated
using (aktif);

create policy "kelompok keahlian aktif dapat dibaca publik"
on public.kelompok_keahlian for select to anon, authenticated
using (aktif);

create policy "keahlian aktif dapat dibaca publik"
on public.keahlian for select to anon, authenticated
using (aktif);

create policy "proyek terbit dapat dibaca publik"
on public.proyek for select to anon, authenticated
using (status = 'terbit');

create policy "gambar proyek terbit dapat dibaca publik"
on public.gambar_proyek for select to anon, authenticated
using (
  aktif
  and exists (
    select 1 from public.proyek
    where proyek.id = gambar_proyek.proyek_id
      and proyek.status = 'terbit'
  )
);

create policy "relasi proyek tag terbit dapat dibaca publik"
on public.proyek_tag for select to anon, authenticated
using (
  exists (
    select 1 from public.proyek
    where proyek.id = proyek_tag.proyek_id
      and proyek.status = 'terbit'
  )
);

create policy "relasi proyek keahlian terbit dapat dibaca publik"
on public.proyek_keahlian for select to anon, authenticated
using (
  exists (
    select 1 from public.proyek
    where proyek.id = proyek_keahlian.proyek_id
      and proyek.status = 'terbit'
  )
);

create policy "area riset aktif dapat dibaca publik"
on public.area_riset for select to anon, authenticated
using (aktif);

create policy "riset terbit dapat dibaca publik"
on public.riset for select to anon, authenticated
using (status = 'terbit');

create policy "relasi riset area terbit dapat dibaca publik"
on public.riset_area for select to anon, authenticated
using (
  exists (
    select 1 from public.riset
    where riset.id = riset_area.riset_id
      and riset.status = 'terbit'
  )
);

create policy "catatan riset terbit dapat dibaca publik"
on public.catatan_riset for select to anon, authenticated
using (status = 'terbit');

create policy "relasi riset tag terbit dapat dibaca publik"
on public.riset_tag for select to anon, authenticated
using (
  exists (
    select 1 from public.riset
    where riset.id = riset_tag.riset_id
      and riset.status = 'terbit'
  )
);

create policy "relasi riset keahlian terbit dapat dibaca publik"
on public.riset_keahlian for select to anon, authenticated
using (
  exists (
    select 1 from public.riset
    where riset.id = riset_keahlian.riset_id
      and riset.status = 'terbit'
  )
);

create policy "publikasi terbit dapat dibaca publik"
on public.publikasi for select to anon, authenticated
using (status = 'terbit');

create policy "pengarang terbit dapat dibaca publik"
on public.pengarang for select to anon, authenticated
using (
  exists (
    select 1 from public.publikasi_pengarang
    join public.publikasi on publikasi.id = publikasi_pengarang.publikasi_id
    where publikasi_pengarang.pengarang_id = pengarang.id
      and publikasi.status = 'terbit'
  )
);

create policy "relasi publikasi pengarang terbit dapat dibaca publik"
on public.publikasi_pengarang for select to anon, authenticated
using (
  exists (
    select 1 from public.publikasi
    where publikasi.id = publikasi_pengarang.publikasi_id
      and publikasi.status = 'terbit'
  )
);

create policy "relasi publikasi tag terbit dapat dibaca publik"
on public.publikasi_tag for select to anon, authenticated
using (
  exists (
    select 1 from public.publikasi
    where publikasi.id = publikasi_tag.publikasi_id
      and publikasi.status = 'terbit'
  )
);

create policy "organisasi aktif dapat dibaca publik"
on public.organisasi for select to anon, authenticated
using (aktif);

create policy "pengalaman terbit dapat dibaca publik"
on public.pengalaman for select to anon, authenticated
using (status = 'terbit');

create policy "relasi pengalaman tag terbit dapat dibaca publik"
on public.pengalaman_tag for select to anon, authenticated
using (
  exists (
    select 1 from public.pengalaman
    where pengalaman.id = pengalaman_tag.pengalaman_id
      and pengalaman.status = 'terbit'
  )
);

create policy "komentar terbit dapat dibaca publik"
on public.komentar for select to anon, authenticated
using (status = 'terbit');

do $$
declare
  nama_tabel text;
begin
  foreach nama_tabel in array array[
    'admin', 'profil', 'metrik', 'pengaturan', 'media',
    'kategori_proyek', 'tag', 'kelompok_keahlian', 'keahlian',
    'proyek', 'gambar_proyek', 'proyek_tag', 'proyek_keahlian',
    'area_riset', 'riset', 'riset_area', 'catatan_riset', 'riset_tag', 'riset_keahlian',
    'publikasi', 'pengarang', 'publikasi_pengarang', 'publikasi_tag',
    'organisasi', 'pengalaman', 'pengalaman_tag',
    'komentar', 'moderasi_komentar', 'transmisi'
  ]
  loop
    execute format(
      'create policy "admin dapat mengelola %1$s" on public.%1$I for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()))',
      nama_tabel
    );
  end loop;
end;
$$;

-- Explicit API privileges. RLS still determines which rows can be accessed.
grant select on table
  public.profil,
  public.metrik,
  public.pengaturan,
  public.media,
  public.kategori_proyek,
  public.tag,
  public.kelompok_keahlian,
  public.keahlian,
  public.proyek,
  public.gambar_proyek,
  public.proyek_tag,
  public.proyek_keahlian,
  public.area_riset,
  public.riset,
  public.riset_area,
  public.catatan_riset,
  public.riset_tag,
  public.riset_keahlian,
  public.publikasi,
  public.pengarang,
  public.publikasi_pengarang,
  public.publikasi_tag,
  public.organisasi,
  public.pengalaman,
  public.pengalaman_tag,
  public.komentar
to anon, authenticated;

grant select, insert, update, delete on table
  public.admin,
  public.profil,
  public.metrik,
  public.pengaturan,
  public.media,
  public.kategori_proyek,
  public.tag,
  public.kelompok_keahlian,
  public.keahlian,
  public.proyek,
  public.gambar_proyek,
  public.proyek_tag,
  public.proyek_keahlian,
  public.area_riset,
  public.riset,
  public.riset_area,
  public.catatan_riset,
  public.riset_tag,
  public.riset_keahlian,
  public.publikasi,
  public.pengarang,
  public.publikasi_pengarang,
  public.publikasi_tag,
  public.organisasi,
  public.pengalaman,
  public.pengalaman_tag,
  public.komentar,
  public.moderasi_komentar,
  public.transmisi
to authenticated;

-- Public reads use the bucket URL. Upload, update, and delete remain admin-only.
insert into storage.buckets (id, name, public)
values ('portofolio', 'portofolio', true)
on conflict (id) do update set public = excluded.public;

create policy "admin dapat upload asset portofolio"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'portofolio'
  and (select private.is_admin())
);

create policy "admin dapat update asset portofolio"
on storage.objects for update to authenticated
using (
  bucket_id = 'portofolio'
  and (select private.is_admin())
)
with check (
  bucket_id = 'portofolio'
  and (select private.is_admin())
);

create policy "admin dapat hapus asset portofolio"
on storage.objects for delete to authenticated
using (
  bucket_id = 'portofolio'
  and (select private.is_admin())
);
