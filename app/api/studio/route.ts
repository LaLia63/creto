import { z } from 'zod';
import { CARD_STYLES, SOCIAL_PLATFORMS } from '@/lib/creto';
import { createClient } from '@/lib/supabase/server';

const cardStyleIds = CARD_STYLES.map((style) => style.id) as [
  (typeof CARD_STYLES)[number]['id'],
  ...(typeof CARD_STYLES)[number]['id'][],
];
const socialPlatformIds = SOCIAL_PLATFORMS.map((platform) => platform.id) as [
  (typeof SOCIAL_PLATFORMS)[number]['id'],
  ...(typeof SOCIAL_PLATFORMS)[number]['id'][],
];

const linkSchema = z.object({
  platform: z.enum(socialPlatformIds),
  url: z.url().refine((value) => value.startsWith('http://') || value.startsWith('https://')),
});

const saveRequestSchema = z.object({
  generate: z.boolean(),
  profile: z.object({
    slug: z.string().trim().min(1).max(48),
    name: z.string().trim().min(1).max(120),
    bio: z.string().trim().max(600),
    email: z.string().trim().max(254),
    phone: z.string().trim().max(50),
    avatar_data_url: z.string().max(3_000_000).nullable(),
    card_style: z.enum(cardStyleIds),
    theme_mode: z.enum(['light', 'dark']),
    published: z.boolean(),
  }),
  links: z.array(linkSchema).max(5),
});

async function getAuthenticatedClient() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  return { supabase, user, error };
}

export async function GET() {
  try {
    const { supabase, user, error: authError } = await getAuthenticatedClient();
    if (authError || !user) return Response.json({ error: 'Sign in to continue.' }, { status: 401 });

    const { data: profile, error: profileError } = await supabase
      .from('creto_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profileError) throw profileError;
    if (!profile) return Response.json({ profile: null, links: [], views: [] });

    const [{ data: links, error: linksError }, { data: views, error: viewsError }] = await Promise.all([
      supabase.from('creto_social_links').select('*').eq('profile_id', profile.id).order('position'),
      supabase.from('creto_page_views').select('viewed_at').eq('profile_id', profile.id).order('viewed_at', { ascending: false }),
    ]);

    if (linksError) throw linksError;
    if (viewsError) throw viewsError;

    return Response.json({ profile, links: links ?? [], views: views ?? [] });
  } catch (error) {
    console.error('[studio] load failed', { error: error instanceof Error ? error.message : 'Unknown error' });
    return Response.json({ error: 'Could not load your Creto profile. Please try again.' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = saveRequestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message || 'Check your profile details and try again.' },
      { status: 400 },
    );
  }

  try {
    const { supabase, user, error: authError } = await getAuthenticatedClient();
    if (authError || !user) return Response.json({ error: 'Sign in to continue.' }, { status: 401 });

    const { generate, profile, links } = parsed.data;
    console.info('[studio] save received', { publish: generate, linkCount: links.length });
    const { data: saved, error: profileError } = await supabase
      .from('creto_profiles')
      .upsert({
        ...profile,
        user_id: user.id,
        published: generate || profile.published,
      }, { onConflict: 'user_id' })
      .select()
      .single();

    if (profileError || !saved) throw profileError ?? new Error('Profile was not returned after saving.');

    const { error: deleteError } = await supabase
      .from('creto_social_links')
      .delete()
      .eq('profile_id', saved.id);
    if (deleteError) throw deleteError;

    if (links.length) {
      const { error: linksError } = await supabase.from('creto_social_links').insert(
        links.map((link, position) => ({
          profile_id: saved.id,
          platform: link.platform,
          url: link.url.trim(),
          position,
        })),
      );
      if (linksError) throw linksError;
    }

    console.info('[studio] save succeeded', { publish: saved.published, linkCount: links.length });
    return Response.json({ profile: saved });
  } catch (error) {
    console.error('[studio] save failed', { error: error instanceof Error ? error.message : 'Unknown error' });
    return Response.json({ error: 'Could not save your profile. Please try again.' }, { status: 503 });
  }
}
