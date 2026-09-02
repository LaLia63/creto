import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeftIcon as ArrowLeft, QrCodeIcon as QrCode, SparkleIcon as Sparkle } from '@phosphor-icons/react/dist/ssr';
import { AuthPanel } from '@/components/auth-panel';

export const metadata: Metadata = { title: 'Sign in or create an account' };

export default function AuthPage() {
  return (
    <main className="grid min-h-screen bg-[#fff9fb] lg:grid-cols-[.9fr_1.1fr] dark:bg-[#18020b]">
      <section className="relative hidden overflow-hidden bg-[#3A0519] p-12 text-white lg:flex lg:flex-col">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 15% 20%,#EF88AD 0,transparent 24%),radial-gradient(circle at 85% 78%,#A53860 0,transparent 30%)' }} />
        <div className="hero-grid absolute inset-0 opacity-20" />
        <Link href="/" className="relative z-10 flex items-center gap-3 font-serif text-3xl font-bold"><Image src="/logo-circle.png" alt="Creto" width={44} height={44} className="rounded-full" /> Creto</Link>
        <div className="relative z-10 my-auto max-w-lg">
          <div className="mb-7 flex size-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10"><QrCode size={28} weight="bold" /></div>
          <h1 className="font-serif text-6xl font-semibold leading-[.9] tracking-tight">Make every introduction unforgettable.</h1>
          <p className="mt-7 text-base leading-7 text-white/65">Build one elegant profile that moves with you — from first hello to lasting connection.</p>
          <p className="mt-2 text-sm text-[#EF88AD]">(ပထမဆုံး မိတ်ဆက်မှုကနေ ရေရှည်ဆက်သွယ်မှုအထိ သင့်နဲ့အတူ အမြဲအသင့်ရှိမယ့် profile တစ်ခု ဖန်တီးပါ)</p>
        </div>
        <p className="relative z-10 flex items-center gap-2 text-xs text-white/50"><Sparkle weight="fill" /> Simple. Creative. Memorable.</p>
      </section>
      <section className="relative flex items-center justify-center px-5 py-24 sm:px-10">
        <Link href="/" className="absolute left-5 top-5 flex items-center gap-2 text-sm font-bold text-muted-foreground sm:left-10 sm:top-8"><ArrowLeft /> Back home</Link>
        <AuthPanel />
      </section>
    </main>
  );
}
