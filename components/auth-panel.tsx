'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Eye, EyeSlash, SpinnerGap } from '@phosphor-icons/react';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const credentialsSchema = z.object({
  email: z.email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

export function AuthPanel() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setSuccess('');
    const data = Object.fromEntries(new FormData(event.currentTarget));
    const parsed = credentialsSchema.safeParse(data);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'Check your details and try again.');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const result = mode === 'signup'
      ? await supabase.auth.signUp({ email: parsed.data.email, password: parsed.data.password })
      : await supabase.auth.signInWithPassword(parsed.data);
    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    if (mode === 'signup' && !result.data.session) {
      setSuccess('Account created. Check your email to confirm, then sign in. (Account ဖန်တီးပြီးပါပြီ။ Email ကိုအတည်ပြုပြီး Sign in ဝင်ပါ)');
      return;
    }

    setSuccess(mode === 'signup' ? 'Your account is ready. Opening your studio…' : 'Welcome back. Opening your studio…');
    router.push('/app');
    router.refresh();
  }

  return (
    <div className="w-full max-w-md">
      <p className="section-kicker">Your Creto studio (သင့် Creto Studio)</p>
      <h1 className="mt-5 font-serif text-5xl font-semibold leading-none tracking-tight">{mode === 'signup' ? 'Create your account.' : 'Welcome back.'}</h1>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">{mode === 'signup' ? 'Start building a profile people remember. (လူတိုင်းမှတ်မိမယ့် profile ကို စတင်ဖန်တီးပါ)' : 'Continue shaping your digital presence. (သင့် digital profile ကို ဆက်လက်ပြင်ဆင်ပါ)'}</p>

      <div className="mt-8 grid grid-cols-2 rounded-2xl bg-[#A53860]/8 p-1">
        {(['signup','login'] as const).map((item) => <button key={item} onClick={() => { setMode(item); setError(''); setSuccess(''); }} className={`rounded-xl px-4 py-3 text-sm font-bold capitalize transition ${mode === item ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}>{item === 'signup' ? 'Sign up (အကောင့်ဖွင့်ရန်)' : 'Login (ဝင်ရောက်ရန်)'}</button>)}
      </div>

      <form onSubmit={submit} className="mt-7 space-y-5" noValidate>
        <div className="space-y-2"><Label htmlFor="email">Email (အီးမေးလ်)</Label><Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" className="h-12 rounded-xl bg-card px-4" required /></div>
        <div className="space-y-2">
          <Label htmlFor="password">Password (စကားဝှက်)</Label>
          <div className="relative"><Input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} placeholder="Minimum 8 characters" className="h-12 rounded-xl bg-card px-4 pr-12" required /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-1.5 top-1.5 grid size-9 place-items-center rounded-lg text-muted-foreground" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeSlash /> : <Eye />}</button></div>
        </div>
        {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {success && <p role="status" className="flex gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><CheckCircle className="mt-0.5 shrink-0" weight="fill" /> {success}</p>}
        <button disabled={loading} className="button-primary min-h-13 w-full disabled:cursor-not-allowed disabled:opacity-60">{loading && <SpinnerGap className="animate-spin" />} {loading ? 'Please wait…' : mode === 'signup' ? 'Create account (အကောင့်ဖွင့်မည်)' : 'Login (ဝင်ရောက်မည်)'}</button>
      </form>
      <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">By continuing, you agree to keep Creto kind, truthful, and useful. (Creto ကို ကောင်းမွန်၊ မှန်ကန်ပြီး အကျိုးရှိစွာ အသုံးပြုရန် သဘောတူပါသည်)</p>
    </div>
  );
}
