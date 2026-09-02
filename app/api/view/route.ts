import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const viewRequestSchema = z.object({
  profileId: z.uuid(),
  referrer: z.string().trim().max(1000).nullable(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = viewRequestSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Invalid view event.' }, { status: 400 });

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('creto_page_views').insert({
      profile_id: parsed.data.profileId,
      referrer: parsed.data.referrer || null,
    });
    if (error) throw error;
    return Response.json({ ok: true });
  } catch (error) {
    console.error('[view] tracking failed', { error: error instanceof Error ? error.message : 'Unknown error' });
    return Response.json({ error: 'Could not record this view.' }, { status: 503 });
  }
}
