import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Code, EnvelopeSimple, GithubLogo, PaperPlaneTilt, Sparkle } from '@phosphor-icons/react/dist/ssr';
import { SiteHeader } from '@/components/site-header';

export const metadata: Metadata = { title: 'Creator — Hsu Yati Zaw', description: 'Meet Hsu Yati Zaw (Lia), the creator and developer behind Creto.' };

const skills = [
  ['React', 'Interfaces that feel natural'], ['TypeScript', 'Confident, scalable code'],
  ['Next.js', 'Fast full-stack products'], ['Node.js', 'Reliable backend systems'],
  ['PostgreSQL', 'Thoughtful data architecture'], ['Tailwind CSS', 'Precise responsive UI'],
  ['UI/UX Design', 'Clarity in every interaction'], ['Graphic Design', 'Visual stories with character'],
];

export default function CreatorPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <SiteHeader />
      <section className="relative isolate px-5 pb-24 pt-36 sm:px-8 lg:px-12 lg:pt-44">
        <div className="hero-grid absolute inset-0 -z-10" /><div className="rose-orb absolute -right-32 top-10 -z-10 h-[34rem] w-[34rem] opacity-50" />
        <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[.9fr_1.1fr]">
          <div className="relative mx-auto grid aspect-square w-full max-w-[520px] place-items-center">
            <div className="creator-orbit orbit-one"><span>React</span><span>Design</span><span>Build</span></div>
            <div className="creator-orbit orbit-two"><i /><i /><i /><i /></div>
            <div className="relative h-[72%] w-[72%] overflow-hidden rounded-[44%_56%_42%_58%] border-4 border-[#EF88AD]/50 bg-[#670D2F] shadow-[0_35px_90px_rgba(58,5,25,.3)]">
              <Image src="/hsu-yati-zaw.webp" alt="Hsu Yati Zaw" fill priority className="object-cover" sizes="(max-width: 768px) 70vw, 420px" />
            </div>
            <div className="absolute bottom-3 right-2 rounded-2xl border bg-card/90 px-4 py-3 shadow-xl backdrop-blur-xl"><p className="text-xs font-bold">Creator of Creto</p><p className="mt-1 text-[10px] text-muted-foreground">Built with curiosity + care</p></div>
          </div>
          <div>
            <p className="section-kicker"><Sparkle weight="fill" /> Meet the creator (ဖန်တီးသူနှင့် မိတ်ဆက်ခြင်း)</p>
            <h1 className="mt-7 font-serif text-[clamp(4rem,9vw,8rem)] font-bold leading-[.8] tracking-[-.055em]">Hsu Yati<br/><span className="text-gradient">Zaw.</span></h1>
            <p className="mt-8 max-w-2xl text-xl font-semibold leading-8">Full-stack developer, system thinker, and UI/UX designer crafting digital products with both structure and soul.</p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">(System architecture ခိုင်မာမှုနဲ့ လူတွေအတွက် သုံးရလွယ်ကူပျော်ရွှင်စေမယ့် design ကို ပေါင်းစပ်ပြီး digital product များ ဖန်တီးသူပါ)</p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">I love turning complex ideas into calm, memorable experiences — from optimized databases and dependable backends to interfaces that feel immediately familiar. Creto began with one belief: your online identity should feel as thoughtful as the work you do.</p>
            <div className="mt-8 flex flex-wrap gap-3"><a href="https://t.me/VelvetLia635" target="_blank" rel="noreferrer" className="button-primary"><PaperPlaneTilt weight="fill" /> Telegram</a><a href="https://github.com/LaLia63" target="_blank" rel="noreferrer" className="button-secondary"><GithubLogo weight="fill" /> GitHub</a></div>
          </div>
        </div>
      </section>

      <section className="border-y bg-[#3A0519] px-5 py-24 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl"><div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr]"><div><p className="section-kicker border-white/15 bg-white/5 text-[#EF88AD]">Skills (ကျွမ်းကျင်မှုများ)</p><h2 className="mt-5 font-serif text-5xl font-bold leading-[.9]">Designing the system and the feeling.</h2><p className="mt-5 text-sm leading-7 text-white/55">Every layer matters — the data, the motion, the copy, and the quiet details between them.</p></div><div className="grid gap-3 sm:grid-cols-2">{skills.map(([name,note],index) => <article key={name} className="skill-card group"><span className="text-xs text-[#EF88AD]">0{index+1}</span><div><h3 className="font-serif text-2xl font-bold">{name}</h3><p className="text-xs text-white/45">{note}</p></div><Code className="ml-auto text-white/20 transition group-hover:rotate-6 group-hover:text-[#EF88AD]" /></article>)}</div></div></div>
      </section>

      <section className="px-5 py-28 text-center sm:px-8">
        <div className="mx-auto max-w-4xl rounded-[2.5rem] border bg-gradient-to-br from-[#EF88AD]/20 via-card to-[#A53860]/10 px-6 py-20 shadow-[0_30px_90px_rgba(58,5,25,.12)]">
          <EnvelopeSimple className="mx-auto text-[#A53860]" size={36} weight="duotone" />
          <h2 className="mt-5 font-serif text-6xl font-bold tracking-tight">Have a Project in Mind?</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground">Let’s shape it into something clear, useful, and memorable. (သင့်စိတ်ကူးကို ရှင်းလင်း၊ အသုံးဝင်ပြီး မှတ်မိလွယ်တဲ့ product တစ်ခုဖြစ်အောင် အတူဖန်တီးကြမယ်)</p>
          <a href="mailto:lia.thedev@gmail.com?subject=Project%20with%20Hsu%20Yati%20Zaw" className="button-primary group mt-8">Let’s Work Together (အတူအလုပ်လုပ်ကြမယ်)<ArrowRight className="transition group-hover:translate-x-1" /></a>
        </div>
      </section>
      <footer className="border-t px-5 py-7 text-center text-xs text-muted-foreground">Designed and built with care by <Link href="/creator" className="font-bold text-foreground">Hsu Yati Zaw</Link>.</footer>
    </main>
  );
}
