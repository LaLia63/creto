import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const authRequestSchema = z.object({
  mode: z.enum(['login', 'signup']),
  email: z.email('Enter a valid email address.').trim().toLowerCase(),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = authRequestSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message || 'Check your details and try again.' },
      { status: 400 },
    );
  }

  try {
    const supabase = await createClient();
    const { mode, email, password } = parsed.data;
    console.info('[auth] request received', { mode });
    const result = mode === 'signup'
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      console.warn('[auth] request rejected', { mode, status: result.error.status });
      return Response.json({ error: result.error.message }, { status: 400 });
    }

    if (!result.data.session) {
      console.warn('[auth] session missing after successful request', { mode });
      return Response.json(
        { error: 'Your account was created, but a session could not be started. Please try logging in.' },
        { status: 409 },
      );
    }

    console.info('[auth] session created', { mode });
    return Response.json({ ok: true });
  } catch (error) {
    console.error('[auth] service unavailable', { error: error instanceof Error ? error.message : 'Unknown error' });
    return Response.json(
      { error: 'The account service is temporarily unavailable. Please try again.' },
      { status: 503 },
    );
  }
}
