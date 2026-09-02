import type { Metadata } from 'next';
import { cache } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon as ArrowLeft, ShareNetworkIcon as ShareNetwork } from '@phosphor-icons/react/dist/ssr';
import { CardPreview } from '@/components/card-preview';
import { ViewTracker } from '@/components/view-tracker';
import { createClient } from '@/lib/supabase/server';
import type { CretoProfile, SocialLink } from '@/lib/creto';

const getProfile = cache(async (slug: string) => {
  const supabase = await createClient();
  const { data } = await supabase.from('creto_profiles').select('*').eq('slug', slug).eq('published', true).maybeSingle();
  if (!data) return null;
  const { data: links } = await supabase.from('creto_social_links').select('*').eq('profile_id', data.id).order('position');
  return { profile: data as CretoProfile, links: (links || []) as SocialLink[] };
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const result = await getProfile(slug);
  if (!result) return { title: 'Profile not found', robots: { index: false, follow: false } };
  const title = `${result.profile.name} — Digital Profile`;
  const description = result.profile.bio || `Connect with ${result.profile.name} on Creto.`;
  return {
    title, description,
    openGraph: { title, description, type: 'profile', images: [] },
    twitter: { card: 'summary', title, description, images: [] },
  };
}

export default async function PublicProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await getProfile(slug);
  if (!result || !result.profile.id) notFound();
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7edf1] px-4 py-7 dark:bg-[#130108] sm:px-7 sm:py-10">
      <ViewTracker profileId={result.profile.id} />
      <div className="rose-orb fixed -left-28 top-20 h-80 w-80 opacity-50" /><div className="rose-orb fixed -right-28 bottom-0 h-96 w-96 opacity-40" />
      <header className="relative z-10 mx-auto mb-6 flex max-w-lg items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xs font-bold text-[#670D2F] dark:text-[#EF88AD]"><ArrowLeft /> Back to Creto</Link>
        <span className="flex items-center gap-2 text-xs text-[#670D2F]/65 dark:text-[#EF88AD]/70"><ShareNetwork /> Share this profile</span>
      </header>
      <div className="relative z-10 mx-auto max-w-lg"><CardPreview profile={result.profile} links={result.links} interactive /></div>
      <footer className="relative z-10 mx-auto mt-7 flex max-w-lg items-center justify-center gap-2 text-xs text-[#670D2F]/60 dark:text-[#EF88AD]/60"><Image src="/logo-circle.png" alt="" width={24} height={24} className="rounded-full" /> Made memorable with <Link href="/" className="font-bold">Creto</Link></footer>
    </main>
  );
}
