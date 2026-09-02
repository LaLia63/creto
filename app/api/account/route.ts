import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const accountRequestSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('password'),
    currentPassword: z.string().min(1),
    nextPassword: z.string().min(8, 'New password needs at least 8 characters.').max(128),
  }),
  z.object({
    action: z.literal('review'),
    body: z.string().trim().min(8, 'Write at least 8 characters.').max(600),
  }),
  z.object({ action: z.literal('logout') }),
]);

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = accountRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message || 'Check your details and try again.' },
      { status: 400 },
    );
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return Response.json({ error: 'Sign in to continue.' }, { status: 401 });

    if (parsed.data.action === 'logout') {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.info('[account] logout succeeded');
      return Response.json({ ok: true });
    }

    if (parsed.data.action === 'password') {
      const { currentPassword, nextPassword } = parsed.data;
      if (currentPassword === nextPassword) {
        return Response.json({ error: 'Choose a new password that is different from your current password.' }, { status: 400 });
      }
      if (!user.email) {
        return Response.json({ error: 'This account does not have an email address for password verification.' }, { status: 400 });
      }

      const { error: passwordCheckError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      if (passwordCheckError) {
        console.warn('[account] current password rejected', { status: passwordCheckError.status });
        return Response.json({ error: 'Current password is not correct. (လက်ရှိစကားဝှက် မမှန်ပါ)' }, { status: 400 });
      }

      const { error } = await supabase.auth.updateUser({
        password: nextPassword,
      });
      if (error) {
        console.warn('[account] password update rejected', { status: error.status });
        return Response.json({ error: error.message }, { status: 400 });
      }

      console.info('[account] password update succeeded');
      return Response.json({ ok: true });
    }

    const { data: review, error } = await supabase
      .from('creto_reviews')
      .insert({ user_id: user.id, body: parsed.data.body, rating: 5 })
      .select('id')
      .single();
    if (error || !review) throw error ?? new Error('Review was not returned after saving.');

    console.info('[account] review submitted');
    return Response.json({ ok: true, reviewId: review.id });
  } catch (error) {
    console.error('[account] request failed', { error: error instanceof Error ? error.message : 'Unknown error' });
    return Response.json({ error: 'The account service is temporarily unavailable. Please try again.' }, { status: 503 });
  }
}
