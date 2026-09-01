'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import QRCode from 'qrcode';
import {
  ArrowDown,
  ArrowUp,
  ArrowSquareOut,
  Check,
  CheckCircle,
  ClipboardText,
  Copy,
  DownloadSimple,
  Eye,
  FacebookLogo,
  FloppyDisk,
  GearSix,
  GithubLogo,
  GlobeSimple,
  InstagramLogo,
  LinkedinLogo,
  LinkSimple,
  Moon,
  PaperPlaneTilt,
  Plus,
  QrCode,
  SignOut,
  SpinnerGap,
  Sun,
  TiktokLogo,
  Trash,
  UploadSimple,
  UserCircle,
} from '@phosphor-icons/react';
import type { ComponentType } from 'react';
import { CardPreview, TemplateSwatch } from '@/components/card-preview';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';
import { CARD_STYLES, EMPTY_PROFILE, SOCIAL_PLATFORMS, type CardStyle, type CretoProfile, type SocialLink, type SocialPlatform } from '@/lib/creto';

const socialIcons: Record<SocialPlatform, ComponentType<{ size?: number; weight?: 'fill' | 'bold' }>> = {
  facebook: FacebookLogo, instagram: InstagramLogo, linkedin: LinkedinLogo,
  github: GithubLogo, tiktok: TiktokLogo, telegram: PaperPlaneTilt, website: GlobeSimple,
};

type ViewRow = { viewed_at: string };

function isValidUrl(value: string) {
  try { const url = new URL(value); return url.protocol === 'https:' || url.protocol === 'http:'; } catch { return false; }
}

function cleanSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
}

export function BuilderStudio({ userId, email }: { userId: string; email: string }) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [tab, setTab] = useState<'setup' | 'profile'>('setup');
  const [profile, setProfile] = useState<CretoProfile>({ ...EMPTY_PROFILE, email });
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [views, setViews] = useState<ViewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [publicUrl, setPublicUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [dark, setDark] = useState(false);
  const [review, setReview] = useState('');
  const [reviewStatus, setReviewStatus] = useState('');
  const [passwordStatus, setPasswordStatus] = useState('');

  const load = useCallback(async () => {
    try {
      const response = await fetch('/api/studio');
      const result = await response.json() as {
        profile?: CretoProfile | null;
        links?: SocialLink[];
        views?: ViewRow[];
        error?: string;
      };
      if (!response.ok) throw new Error(result.error || 'Could not load your profile.');
      if (result.profile) {
        const loaded = result.profile;
        setProfile(loaded);
        setLinks(result.links ?? []);
        setViews(result.views ?? []);
        if (loaded.published) {
          const origin = window.location.origin;
          const url = `${origin}/u/${loaded.slug}`;
          setPublicUrl(url);
          setQrDataUrl(await QRCode.toDataURL(url, { width: 320, margin: 2, color: { dark: '#3A0519', light: '#fffafc' } }));
        }
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Could not load your profile.');
    } finally {
      setDark(document.documentElement.classList.contains('dark'));
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const invalidLinks = links.filter((link) => link.url && !isValidUrl(link.url));
  const sevenDayViews = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(); date.setHours(0, 0, 0, 0); date.setDate(date.getDate() - (6 - index)); return date;
    });
    return days.map((date) => ({
      label: date.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2),
      value: views.filter((row) => new Date(row.viewed_at).toDateString() === date.toDateString()).length,
    }));
  }, [views]);
  const maxViews = Math.max(1, ...sevenDayViews.map((day) => day.value));
  const deferredProfile = useDeferredValue(profile);
  const deferredLinks = useDeferredValue(links);

  function updateProfile<K extends keyof CretoProfile>(key: K, value: CretoProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
    setMessage('Unsaved changes (မသိမ်းရသေးသော ပြောင်းလဲမှုများ)');
  }

  function addLink() {
    if (links.length >= 5) return;
    setLinks((current) => [...current, { platform: 'website', url: '', position: current.length }]);
  }

  function updateLink(index: number, changes: Partial<SocialLink>) {
    setLinks((current) => current.map((link, itemIndex) => itemIndex === index ? { ...link, ...changes } : link));
  }

  function removeLink(index: number) {
    setLinks((current) => current.filter((_, itemIndex) => itemIndex !== index).map((link, position) => ({ ...link, position })));
  }

  function moveLink(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= links.length) return;
    setLinks((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((link, position) => ({ ...link, position }));
    });
  }

  function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Choose an image file. (ဓာတ်ပုံဖိုင်ရွေးပါ)'); return; }
    if (file.size > 2_000_000) { setError('Image must be under 2 MB. (ဓာတ်ပုံ 2 MB အောက်ဖြစ်ရပါမယ်)'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const image = new window.Image();
      image.onload = () => {
        const max = 900;
        const scale = Math.min(1, max / Math.max(image.width, image.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext('2d');
        if (!context) return;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        updateProfile('avatar_data_url', canvas.toDataURL('image/jpeg', .84));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  }

  async function save(generate = false) {
    setError(''); setMessage('');
    if (!profile.name.trim()) { setError('Add your name before saving. (မသိမ်းခင် အမည်ထည့်ပါ)'); return; }
    if (invalidLinks.length || links.some((link) => !link.url)) { setError('Every social link needs a valid http:// or https:// URL. (Social link တိုင်းမှာ မှန်ကန်တဲ့ URL ထည့်ပါ)'); return; }
    setSaving(true);
    const payload = {
      slug: profile.published ? profile.slug : cleanSlug(profile.slug || profile.name) || 'creator',
      name: profile.name.trim(), bio: profile.bio.trim(), email: profile.email.trim(), phone: profile.phone.trim(),
      avatar_data_url: profile.avatar_data_url, card_style: profile.card_style, theme_mode: dark ? 'dark' : 'light',
      published: generate || Boolean(profile.published),
    };
    try {
      const response = await fetch('/api/studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          generate,
          profile: payload,
          links: links.map((link) => ({ platform: link.platform, url: link.url.trim() })),
        }),
      });
      const result = await response.json() as { profile?: CretoProfile; error?: string };
      if (!response.ok || !result.profile) throw new Error(result.error || 'Could not save your profile.');

      const nextProfile = result.profile;
      setProfile(nextProfile);
      setMessage(generate ? 'Your profile is live! (သင့် profile ကို စတင်မျှဝေနိုင်ပါပြီ)' : 'Draft saved. (မူကြမ်း သိမ်းပြီးပါပြီ)');
      if (generate) {
        const url = `${window.location.origin}/u/${nextProfile.slug}`;
        setPublicUrl(url);
        setQrDataUrl(await QRCode.toDataURL(url, { width: 320, margin: 2, color: { dark: '#3A0519', light: '#fffafc' } }));
      }
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save your profile.');
    } finally {
      setSaving(false);
    }
  }

  async function downloadQr() {
    if (!publicUrl) return;
    const canvas = document.createElement('canvas');
    await QRCode.toCanvas(canvas, publicUrl, { width: 1000, margin: 5, color: { dark: '#3A0519', light: '#ffffff' } });
    const link = document.createElement('a'); link.download = `creto-${profile.slug}-qr.jpg`; link.href = canvas.toDataURL('image/jpeg', .94); link.click();
  }

  async function copyLink() {
    await navigator.clipboard.writeText(publicUrl); setCopied(true); setTimeout(() => setCopied(false), 1600);
  }

  function toggleTheme() {
    const next = !dark; setDark(next); document.documentElement.classList.toggle('dark', next); localStorage.setItem('creto-theme', next ? 'dark' : 'light');
  }

  async function logout() {
    await createClient().auth.signOut(); router.push('/'); router.refresh();
  }

  async function changePassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setPasswordStatus('');
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const current = String(values.current || ''); const next = String(values.next || '');
    if (next.length < 8) { setPasswordStatus('New password needs at least 8 characters.'); return; }
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password: current });
    if (signInError) { setPasswordStatus('Current password is not correct. (လက်ရှိစကားဝှက် မမှန်ပါ)'); return; }
    const { error: updateError } = await supabase.auth.updateUser({ password: next });
    setPasswordStatus(updateError ? updateError.message : 'Password updated successfully. (စကားဝှက် ပြောင်းပြီးပါပြီ)');
    if (!updateError) event.currentTarget.reset();
  }

  async function submitReview() {
    setReviewStatus('');
    if (review.trim().length < 8) { setReviewStatus('Write at least 8 characters.'); return; }
    const { error: reviewError } = await createClient().from('creto_reviews').insert({ user_id: userId, body: review.trim(), rating: 5 });
    if (reviewError) setReviewStatus(reviewError.message); else { setReview(''); setReviewStatus('Thank you — your review was shared for moderation. (ကျေးဇူးတင်ပါတယ်။ Review ကို ပို့ပြီးပါပြီ)'); }
  }

  if (loading) return <main className="grid min-h-screen place-items-center"><div className="text-center"><SpinnerGap className="mx-auto animate-spin text-[#A53860]" size={34} /><p className="mt-3 text-sm text-muted-foreground">Preparing your studio…</p></div></main>;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(239,136,173,.14),transparent_30%)]">
      <header className="sticky top-0 z-50 border-b bg-background/80 px-4 py-3 backdrop-blur-xl sm:px-7">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2"><Image src="/logo-circle.png" alt="Creto" width={38} height={38} className="rounded-full" /><b className="font-serif text-2xl">Creto</b><span className="hidden text-xs text-muted-foreground sm:inline">Studio</span></Link>
          <div className="flex items-center gap-1 rounded-full border bg-card p-1">
            <button onClick={() => setTab('setup')} className={`rounded-full px-3 py-2 text-xs font-bold sm:px-5 ${tab === 'setup' ? 'bg-[#670D2F] text-white' : 'text-muted-foreground'}`}><GearSix className="mr-1 inline" /> Setup</button>
            <button onClick={() => setTab('profile')} className={`rounded-full px-3 py-2 text-xs font-bold sm:px-5 ${tab === 'profile' ? 'bg-[#670D2F] text-white' : 'text-muted-foreground'}`}><UserCircle className="mr-1 inline" /> Profile</button>
          </div>
          <div className="flex items-center gap-1"><button onClick={toggleTheme} className="icon-button" aria-label="Toggle theme">{dark ? <Sun /> : <Moon />}</button><button onClick={logout} className="icon-button" aria-label="Logout"><SignOut /></button></div>
        </div>
      </header>

      {tab === 'setup' ? (
        <div className="mx-auto grid max-w-[1500px] gap-7 px-4 py-8 lg:grid-cols-[minmax(0,1fr)_430px] lg:px-7">
          <div className="min-w-0 space-y-6">
            <section className="studio-panel">
              <div className="studio-heading"><span>01</span><div><h2>Your identity (သင့်အကြောင်း)</h2><p>Add the essentials people should remember.</p></div></div>
              <div className="mt-7 grid gap-6 md:grid-cols-[180px_1fr]">
                <div>
                  <Label>Profile image (ကိုယ်ရေးဓာတ်ပုံ)</Label>
                  <div className="mt-3 grid aspect-square place-items-center overflow-hidden rounded-[2rem] border border-dashed bg-muted">
                    {profile.avatar_data_url ? <img src={profile.avatar_data_url} alt="Profile preview" className="h-full w-full object-cover" /> : <UserCircle size={58} className="text-muted-foreground" />}
                  </div>
                  <input ref={fileRef} onChange={uploadAvatar} type="file" accept="image/*" className="hidden" />
                  <div className="mt-3 grid grid-cols-2 gap-2"><button onClick={() => fileRef.current?.click()} className="studio-button"><UploadSimple /> {profile.avatar_data_url ? 'Replace' : 'Upload'}</button><button onClick={() => updateProfile('avatar_data_url', null)} disabled={!profile.avatar_data_url} className="studio-button"><Trash /> Remove</button></div>
                </div>
                <div className="grid content-start gap-5">
                  <div className="space-y-2"><Label htmlFor="name">Name (အမည်)</Label><Input id="name" value={profile.name} onChange={(e) => updateProfile('name', e.target.value)} className="h-12 bg-background px-4" placeholder="Hsu Yati Zaw" /></div>
                  <div className="space-y-2"><Label htmlFor="slug">Public username (မျှဝေမည့် username)</Label><div className="flex h-12 items-center overflow-hidden rounded-lg border bg-background"><span className="border-r px-3 text-xs text-muted-foreground">creto.app/u/</span><input id="slug" value={profile.slug} disabled={profile.published} onChange={(e) => updateProfile('slug', cleanSlug(e.target.value))} className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none disabled:opacity-60" /></div>{profile.published && <p className="text-xs text-muted-foreground">Your username is locked so your QR code always stays valid. (QR မပြောင်းအောင် username ကို lock လုပ်ထားပါတယ်)</p>}</div>
                  <div className="space-y-2"><Label htmlFor="bio">Short bio (အကျဉ်းချုပ်)</Label><Textarea id="bio" value={profile.bio} onChange={(e) => updateProfile('bio', e.target.value.slice(0, 220))} className="min-h-28 bg-background p-4" /><p className="text-right text-xs text-muted-foreground">{profile.bio.length}/220</p></div>
                  <div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label>Email (အီးမေးလ်)</Label><Input type="email" value={profile.email} onChange={(e) => updateProfile('email', e.target.value)} className="h-12 bg-background px-4" /></div><div className="space-y-2"><Label>Phone (ဖုန်း)</Label><Input type="tel" value={profile.phone} onChange={(e) => updateProfile('phone', e.target.value)} className="h-12 bg-background px-4" placeholder="+95…" /></div></div>
                </div>
              </div>
            </section>

            <section className="studio-panel">
              <div className="studio-heading"><span>02</span><div><h2>Choose a card style (Card ပုံစံရွေးပါ)</h2><p>Twenty reusable SVG-led styles, each with its own rhythm.</p></div></div>
              <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
                {CARD_STYLES.map((style) => <button key={style.id} onClick={() => updateProfile('card_style', style.id as CardStyle)} className={`rounded-2xl border p-2 text-left transition hover:-translate-y-1 hover:shadow-lg ${profile.card_style === style.id ? 'border-[#A53860] ring-2 ring-[#A53860]/20' : 'bg-background'}`}><TemplateSwatch style={style.id as CardStyle} /><span className="mt-2 block text-xs font-bold">{style.label}</span><span className="text-[10px] text-muted-foreground">{style.note}</span></button>)}
              </div>
            </section>

            <section className="studio-panel">
              <div className="flex items-start justify-between gap-4"><div className="studio-heading"><span>03</span><div><h2>Social links (Social ချိတ်ဆက်မှုများ)</h2><p>Add, reorder, or remove up to five destinations.</p></div></div><button onClick={addLink} disabled={links.length >= 5} className="studio-button shrink-0"><Plus /> Add {links.length}/5</button></div>
              <div className="mt-7 space-y-3">
                {links.map((link, index) => { const Icon = socialIcons[link.platform]; return <div key={index} className="grid items-center gap-2 rounded-2xl border bg-background p-3 sm:grid-cols-[auto_150px_1fr_auto]"><span className="grid size-10 place-items-center rounded-xl bg-[#A53860]/10 text-[#A53860]"><Icon weight="fill" /></span><select aria-label="Social platform" value={link.platform} onChange={(e) => updateLink(index, { platform: e.target.value as SocialPlatform })} className="h-11 rounded-xl border bg-background px-3 text-sm">{SOCIAL_PLATFORMS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select><Input aria-invalid={Boolean(link.url && !isValidUrl(link.url))} value={link.url} onChange={(e) => updateLink(index, { url: e.target.value })} placeholder={SOCIAL_PLATFORMS.find((item) => item.id === link.platform)?.placeholder} className="h-11 px-3" /><div className="flex gap-1"><button onClick={() => moveLink(index,-1)} disabled={index === 0} className="mini-icon" aria-label="Move up"><ArrowUp /></button><button onClick={() => moveLink(index,1)} disabled={index === links.length - 1} className="mini-icon" aria-label="Move down"><ArrowDown /></button><button onClick={() => removeLink(index)} className="mini-icon text-red-600" aria-label="Remove"><Trash /></button></div></div>; })}
                {!links.length && <div className="rounded-2xl border border-dashed py-10 text-center text-sm text-muted-foreground"><LinkSimple className="mx-auto mb-2" size={28} />No links yet. Add the places where people can find you. (သင့်ကို ဆက်သွယ်နိုင်မယ့် link များထည့်ပါ)</div>}
              </div>
            </section>

            {error && <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</p>}
            {message && <p role="status" className="flex items-center gap-2 rounded-2xl border border-[#A53860]/20 bg-[#EF88AD]/10 px-5 py-4 text-sm text-[#670D2F] dark:text-[#ffdbe8]"><CheckCircle weight="fill" />{message}</p>}
            <div className="flex flex-col justify-end gap-3 sm:flex-row"><button onClick={() => save(false)} disabled={saving} className="button-secondary"><FloppyDisk /> Save draft (မူကြမ်းသိမ်းမည်)</button><button onClick={() => save(true)} disabled={saving} className="button-primary">{saving ? <SpinnerGap className="animate-spin" /> : <QrCode />} Generate & publish (QR ထုတ်ပြီး မျှဝေမည်)</button></div>

            {qrDataUrl && <section className="studio-panel border-[#A53860]/30 bg-gradient-to-br from-[#fff] to-[#fce8ef] text-[#3A0519] dark:from-[#2d0715] dark:to-[#3A0519] dark:text-white"><div className="grid items-center gap-8 md:grid-cols-[240px_1fr]"><img src={qrDataUrl} alt="Your Creto QR code" className="w-full rounded-3xl bg-white p-3 shadow-xl" /><div><p className="section-kicker">You’re live (စတင်မျှဝေနိုင်ပါပြီ)</p><h2 className="mt-4 font-serif text-4xl font-bold">One scan. Your whole story.</h2><p className="mt-3 text-sm leading-6 opacity-70">This QR always opens your public URL, so you can update your profile without replacing the code. (Profile ပြင်လဲ QR code ကို ပြန်လဲစရာမလိုပါ)</p><div className="mt-5 flex overflow-hidden rounded-xl border bg-white/70 text-[#3A0519]"><input value={publicUrl} readOnly className="min-w-0 flex-1 bg-transparent px-4 text-xs outline-none" /><button onClick={copyLink} className="border-l px-4 py-3 text-xs font-bold">{copied ? <Check /> : <Copy />}</button></div><div className="mt-4 flex flex-wrap gap-2"><button onClick={downloadQr} className="studio-button"><DownloadSimple /> Download JPEG</button><Link href={`/u/${profile.slug}`} target="_blank" className="studio-button"><ArrowSquareOut /> Open profile</Link></div></div></div></section>}
          </div>

          <aside className="lg:sticky lg:top-24 lg:h-fit"><div className="mb-3 flex items-center justify-between"><div><p className="text-sm font-bold">Live preview (တိုက်ရိုက်ကြည့်ရန်)</p><p className="text-xs text-muted-foreground">Updates as you type</p></div><Eye className="text-[#A53860]" /></div><CardPreview profile={deferredProfile} links={deferredLinks} compact /></aside>
        </div>
      ) : (
        <div className="mx-auto max-w-6xl space-y-7 px-4 py-9 sm:px-7">
          <div><p className="section-kicker">Profile & analytics (Profile နှင့် ကြည့်ရှုမှုများ)</p><h1 className="mt-4 font-serif text-5xl font-bold">Your profile, at a glance.</h1></div>
          <section className="grid gap-5 md:grid-cols-3"><div className="metric-card"><Eye /><b>{views.length}</b><span>Total profile views (စုစုပေါင်းကြည့်ရှုမှု)</span></div><div className="metric-card"><ClipboardText /><b>{views.filter((row) => Date.now() - new Date(row.viewed_at).getTime() < 7*86400000).length}</b><span>Last 7 days (နောက်ဆုံး ၇ ရက်)</span></div><div className="metric-card"><LinkSimple /><b className="truncate text-2xl">/{profile.slug}</b><span>Public profile (မျှဝေထားသော Profile)</span></div></section>
          <section className="studio-panel"><div className="flex items-center justify-between"><div><h2 className="font-serif text-3xl font-bold">Traffic this week</h2><p className="text-sm text-muted-foreground">Daily profile opens (နေ့စဉ်ကြည့်ရှုမှု)</p></div>{profile.published && <Link href={`/u/${profile.slug}`} target="_blank" className="studio-button"><ArrowSquareOut /> View live</Link>}</div><div className="mt-8 grid h-52 grid-cols-7 items-end gap-3 border-b px-2">{sevenDayViews.map((day) => <div key={day.label} className="flex h-full flex-col items-center justify-end gap-2"><span className="text-xs font-bold">{day.value}</span><div className="w-full max-w-12 rounded-t-xl bg-gradient-to-t from-[#670D2F] to-[#EF88AD] transition-all" style={{ height: `${Math.max(6,(day.value/maxViews)*150)}px` }} /><span className="pb-2 text-[10px] text-muted-foreground">{day.label}</span></div>)}</div></section>
          <div className="grid gap-7 lg:grid-cols-2">
            <section className="studio-panel"><h2 className="font-serif text-3xl font-bold">Change password (စကားဝှက်ပြောင်းရန်)</h2><p className="mt-1 text-sm text-muted-foreground">Confirm your current password first.</p><form onSubmit={changePassword} className="mt-6 space-y-4"><div className="space-y-2"><Label>Current password</Label><Input name="current" type="password" className="h-12 px-4" required /></div><div className="space-y-2"><Label>New password</Label><Input name="next" type="password" className="h-12 px-4" minLength={8} required /></div>{passwordStatus && <p className="text-sm text-[#A53860]">{passwordStatus}</p>}<button className="button-primary w-full">Update password</button></form></section>
            <section className="studio-panel"><h2 className="font-serif text-3xl font-bold">Share a review (သုံးသပ်ချက်ရေးရန်)</h2><p className="mt-1 text-sm text-muted-foreground">Tell us what Creto helped you do.</p><Textarea value={review} onChange={(e) => setReview(e.target.value.slice(0,600))} className="mt-6 min-h-40 p-4" placeholder="Creto made it easier to…" /><div className="mt-2 flex justify-between text-xs text-muted-foreground"><span>{reviewStatus}</span><span>{review.length}/600</span></div><button onClick={submitReview} className="button-primary mt-4 w-full"><PaperPlaneTilt /> Send review</button></section>
          </div>
        </div>
      )}
    </main>
  );
}
