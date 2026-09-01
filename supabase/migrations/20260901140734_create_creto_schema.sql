create schema if not exists creto_private;

create table public.creto_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  slug text not null unique,
  name text not null default '',
  bio text not null default '',
  email text not null default '',
  phone text not null default '',
  avatar_data_url text,
  card_style text not null default 'minimal' check (
    card_style in (
      'minimal', 'elegant', 'glass', 'editorial', 'creative',
      'botanical', 'midnight', 'soft-rose', 'professional', 'developer',
      'business', 'mono', 'gradient', 'organic', 'modern', 'luxury',
      'neon', 'retro', 'playful', 'brutalist'
    )
  ),
  theme_mode text not null default 'light' check (theme_mode in ('light', 'dark')),
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.creto_social_links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.creto_profiles(id) on delete cascade,
  platform text not null check (
    platform in ('facebook', 'instagram', 'linkedin', 'github', 'tiktok', 'telegram', 'website')
  ),
  url text not null check (url ~* '^https?://'),
  position smallint not null check (position between 0 and 4),
  created_at timestamptz not null default now(),
  unique (profile_id, position)
);

create table public.creto_page_views (
  id bigint generated always as identity primary key,
  profile_id uuid not null references public.creto_profiles(id) on delete cascade,
  referrer text,
  viewed_at timestamptz not null default now()
);

create table public.creto_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 8 and 600),
  rating smallint not null default 5 check (rating between 1 and 5),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create index creto_social_links_profile_id_idx on public.creto_social_links (profile_id);
create index creto_page_views_profile_date_idx on public.creto_page_views (profile_id, viewed_at desc);
create index creto_reviews_user_id_idx on public.creto_reviews (user_id);
create index creto_reviews_approved_date_idx on public.creto_reviews (approved, created_at desc) where approved = true;

create or replace function creto_private.assign_profile_slug()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  base_slug text;
  candidate text;
  suffix integer := 1;
begin
  if tg_op = 'UPDATE' and old.published then
    new.slug := old.slug;
    return new;
  end if;

  base_slug := lower(regexp_replace(coalesce(nullif(new.slug, ''), nullif(new.name, ''), 'creator'), '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  if base_slug = '' then
    base_slug := 'creator';
  end if;

  candidate := left(base_slug, 48);
  while exists (
    select 1
    from public.creto_profiles p
    where p.slug = candidate and p.id is distinct from new.id
  ) loop
    suffix := suffix + 1;
    candidate := left(base_slug, 48 - length(suffix::text)) || suffix::text;
  end loop;

  new.slug := candidate;
  return new;
end;
$$;

create or replace function creto_private.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger creto_profiles_assign_slug
before insert or update of slug on public.creto_profiles
for each row execute function creto_private.assign_profile_slug();

create trigger creto_profiles_touch_updated_at
before update on public.creto_profiles
for each row execute function creto_private.touch_updated_at();

alter table public.creto_profiles enable row level security;
alter table public.creto_social_links enable row level security;
alter table public.creto_page_views enable row level security;
alter table public.creto_reviews enable row level security;

revoke all on table public.creto_profiles from anon, authenticated;
revoke all on table public.creto_social_links from anon, authenticated;
revoke all on table public.creto_page_views from anon, authenticated;
revoke all on table public.creto_reviews from anon, authenticated;

grant select on table public.creto_profiles to anon, authenticated;
grant insert, update on table public.creto_profiles to authenticated;
grant select on table public.creto_social_links to anon, authenticated;
grant insert, update, delete on table public.creto_social_links to authenticated;
grant insert on table public.creto_page_views to anon, authenticated;
grant select on table public.creto_page_views to authenticated;
grant select on table public.creto_reviews to anon, authenticated;
grant insert on table public.creto_reviews to authenticated;
grant usage, select on sequence public.creto_page_views_id_seq to anon, authenticated;

create policy "creto profiles are public when published"
on public.creto_profiles for select
to anon, authenticated
using (published or (select auth.uid()) = user_id);

create policy "creto users create their own profile"
on public.creto_profiles for insert
to authenticated
with check ((select auth.uid()) = user_id);

create policy "creto users update their own profile"
on public.creto_profiles for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "creto social links follow profile visibility"
on public.creto_social_links for select
to anon, authenticated
using (
  exists (
    select 1 from public.creto_profiles p
    where p.id = profile_id
      and (p.published or p.user_id = (select auth.uid()))
  )
);

create policy "creto users create links for their profile"
on public.creto_social_links for insert
to authenticated
with check (
  exists (
    select 1 from public.creto_profiles p
    where p.id = profile_id and p.user_id = (select auth.uid())
  )
);

create policy "creto users update links for their profile"
on public.creto_social_links for update
to authenticated
using (
  exists (
    select 1 from public.creto_profiles p
    where p.id = profile_id and p.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.creto_profiles p
    where p.id = profile_id and p.user_id = (select auth.uid())
  )
);

create policy "creto users remove links from their profile"
on public.creto_social_links for delete
to authenticated
using (
  exists (
    select 1 from public.creto_profiles p
    where p.id = profile_id and p.user_id = (select auth.uid())
  )
);

create policy "creto published profiles accept view events"
on public.creto_page_views for insert
to anon, authenticated
with check (
  exists (
    select 1 from public.creto_profiles p
    where p.id = profile_id and p.published
  )
);

create policy "creto owners read their profile views"
on public.creto_page_views for select
to authenticated
using (
  exists (
    select 1 from public.creto_profiles p
    where p.id = profile_id and p.user_id = (select auth.uid())
  )
);

create policy "creto approved reviews are public"
on public.creto_reviews for select
to anon, authenticated
using (approved or user_id = (select auth.uid()));

create policy "creto users submit their own review"
on public.creto_reviews for insert
to authenticated
with check ((select auth.uid()) = user_id);

revoke all on schema creto_private from public, anon, authenticated;
revoke execute on function creto_private.assign_profile_slug() from public, anon, authenticated;
revoke execute on function creto_private.touch_updated_at() from public, anon, authenticated;
