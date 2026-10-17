-- ============================================================
-- 区块链云存储系统 · Supabase 数据库初始化脚本
-- 使用方法：Supabase Dashboard → SQL Editor → 粘贴本脚本 → Run
-- 适用于新创建的项目，可重复执行（幂等）
-- ============================================================

-- 1. 用户资料表（与 Supabase Auth 用户一一对应）
create table if not exists public.profiles (
  id uuid references auth.users (id) on delete cascade primary key,
  username text unique not null,
  nickname text,
  public_key text,
  avatar text,
  role text not null default 'user',
  created_at timestamptz not null default now()
);

-- 2. 文件元数据表（文件本体存放在 Storage 的 user-files 桶中）
create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  file_name text not null,
  original_name text,
  file_size bigint,
  file_hash text,
  storage_path text,
  folder_id uuid references public.folders (id) on delete set null,
  description text,
  upload_time timestamptz not null default now(),
  status integer not null default 1,
  mime_type text,
  blockchain_tx text
);

-- 2.1 文件夹表（用户自建目录；parent_id 为 null 表示根目录）
create table if not exists public.folders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  parent_id uuid references public.folders (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- 同用户、同父目录下文件夹名唯一（含根目录，用 coalesce 处理 NULL）
create unique index if not exists folders_user_parent_name_idx
  on public.folders (user_id, coalesce(parent_id, '00000000-0000-0000-0000-000000000000'), name);

-- 常用索引
create index if not exists files_user_id_idx on public.files (user_id);
create index if not exists files_upload_time_idx on public.files (upload_time desc);
create index if not exists folders_user_idx on public.folders (user_id);
create index if not exists files_folder_idx on public.files (folder_id);

-- 3. 行级安全（RLS）：每个用户只能访问自己的数据
alter table public.profiles enable row level security;
alter table public.files enable row level security;

-- profiles 策略
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- files 策略
drop policy if exists "files_insert_own" on public.files;
create policy "files_insert_own" on public.files
  for insert with check (auth.uid() = user_id);

drop policy if exists "files_select_own" on public.files;
create policy "files_select_own" on public.files
  for select using (auth.uid() = user_id);

drop policy if exists "files_delete_own" on public.files;
create policy "files_delete_own" on public.files
  for delete using (auth.uid() = user_id);

-- folders 策略
drop policy if exists "folders_select_own" on public.folders;
create policy "folders_select_own" on public.folders
  for select using (auth.uid() = user_id);

drop policy if exists "folders_insert_own" on public.folders;
create policy "folders_insert_own" on public.folders
  for insert with check (auth.uid() = user_id);

drop policy if exists "folders_update_own" on public.folders;
create policy "folders_update_own" on public.folders
  for update using (auth.uid() = user_id);

drop policy if exists "folders_delete_own" on public.folders;
create policy "folders_delete_own" on public.folders
  for delete using (auth.uid() = user_id);

-- 5. API 角色基础权限（PostgREST 以 anon / authenticated 角色访问，缺少则报 permission denied）
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.profiles to anon, authenticated;
grant select, insert, update, delete on public.files to anon, authenticated;
grant select, insert, update, delete on public.folders to anon, authenticated;

-- 4. 存储桶（对象存储，私有）
insert into storage.buckets (id, name, public)
values ('user-files', 'user-files', false)
on conflict (id) do nothing;

-- 存储策略：仅登录用户可操作自己目录（路径首段 = 用户ID）下的对象
drop policy if exists "user_files_select" on storage.objects;
create policy "user_files_select" on storage.objects
  for select using (
    bucket_id = 'user-files'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "user_files_insert" on storage.objects;
create policy "user_files_insert" on storage.objects
  for insert with check (
    bucket_id = 'user-files'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "user_files_delete" on storage.objects;
create policy "user_files_delete" on storage.objects
  for delete using (
    bucket_id = 'user-files'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
