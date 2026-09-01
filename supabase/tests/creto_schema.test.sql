begin;
select plan(12);

select has_table('public', 'creto_profiles', 'profiles table exists');
select has_table('public', 'creto_social_links', 'social links table exists');
select has_table('public', 'creto_page_views', 'page views table exists');
select has_table('public', 'creto_reviews', 'reviews table exists');

select ok((select relrowsecurity from pg_class where oid = 'public.creto_profiles'::regclass), 'profiles RLS is enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.creto_social_links'::regclass), 'social links RLS is enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.creto_page_views'::regclass), 'page views RLS is enabled');
select ok((select relrowsecurity from pg_class where oid = 'public.creto_reviews'::regclass), 'reviews RLS is enabled');

select has_index('public', 'creto_profiles', 'creto_profiles_slug_key', 'profile slugs are unique');
select has_index('public', 'creto_social_links', 'creto_social_links_profile_id_idx', 'social profile FK is indexed');
select has_index('public', 'creto_page_views', 'creto_page_views_profile_date_idx', 'view analytics lookup is indexed');
select has_index('public', 'creto_reviews', 'creto_reviews_user_id_idx', 'review owner FK is indexed');

select * from finish();
rollback;
