import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  ChartLineUp,
  CheckCircle,
  GithubLogo,
  InstagramLogo,
  LinkedinLogo,
  PaintBrushBroad,
  PaperPlaneTilt,
  Play,
  Quotes,
  QrCode,
  Sparkle,
  Star,
} from '@phosphor-icons/react/dist/ssr';
import { SiteHeader } from '@/components/site-header';
import { ProductDemoLoader } from '@/components/product-demo-loader';

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <SiteHeader />
      <section className="relative isolate flex min-h-[760px] items-center px-5 pb-20 pt-32 sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="rose-orb left-[-7rem] top-32 h-80 w-80" />
          <div className="rose-orb right-[-5rem] top-10 h-[28rem] w-[28rem] opacity-60" />
          <div className="hero-grid absolute inset-0" />
        </div>

        <div className="mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[1.05fr_.95fr]">
          <div className="max-w-3xl">
            <div className="eyebrow mb-7 w-fit">
              <Sparkle weight="fill" />
              Your identity, beautifully connected (သင့်ရဲ့ digital identity ကို လှပစွာ ချိတ်ဆက်ပါ)
            </div>
            <h1 className="display-title text-balance text-[clamp(3.4rem,8vw,7.4rem)]">
              Everything You Are,
              <span className="block text-gradient">
                <span className="typing-line">All in One Place.</span>
              </span>
            </h1>
            <p className="mt-8 max-w-2xl text-pretty text-base leading-8 text-muted-foreground sm:text-lg">
              Create a personalized digital space where your links, social profiles, content, projects, and personal brand come together beautifully in one simple, powerful, and shareable profile.
              <span className="mt-2 block text-sm opacity-80">(သင့် link၊ social profile၊ project နဲ့ personal brand အားလုံးကို အလွယ်တကူ share နိုင်တဲ့ profile တစ်ခုထဲ စုစည်းပါ)</span>
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link className="button-primary group" href="/auth">
                Create Your Link Page <span className="opacity-80">(ကိုယ်ပိုင် Page ဖန်တီးရန်)</span>
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a className="button-secondary" href="#how-it-works">
                <Play weight="fill" /> See how it works <span className="opacity-70">(အသုံးပြုပုံကြည့်ရန်)</span>
              </a>
            </div>
            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
              {['Ready in minutes', 'One link, every connection', 'Built for every screen'].map((item) => (
                <span key={item} className="flex items-center gap-2">
                  <CheckCircle className="text-[#A53860]" weight="fill" /> {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[560px] lg:mr-0">
            <div className="mock-browser">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="flex gap-1.5" aria-hidden="true"><i /><i /><i /></div>
                <div className="rounded-full bg-white/8 px-4 py-1.5 text-[11px] text-white/60">creto.app/u/maya</div>
                <QrCode className="text-[#EF88AD]" />
              </div>
              <div className="p-4 sm:p-7">
                <div className="profile-card-demo">
                  <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-br from-[#A53860] via-[#670D2F] to-[#3A0519]" />
                  <div className="relative z-10 flex flex-col items-center px-7 pb-7 pt-16 text-center">
                    <div className="relative h-24 w-24 overflow-hidden rounded-[2rem] border-4 border-[#f8e9ee] bg-[#EF88AD] shadow-xl">
                      <Image src="/hsu-yati-zaw.webp" alt="Creto profile example" fill className="object-cover" sizes="96px" priority />
                    </div>
                    <span className="mt-5 rounded-full bg-[#A53860]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[.18em] text-[#A53860]">Creative Director</span>
                    <h2 className="mt-3 font-serif text-3xl font-semibold text-[#3A0519]">Maya Bennett</h2>
                    <p className="mt-2 max-w-xs text-sm leading-6 text-[#670D2F]/70">Crafting thoughtful brands, vivid stories, and digital experiences with soul.</p>
                    <div className="mt-6 flex gap-3">
                      {[InstagramLogo, LinkedinLogo, GithubLogo].map((Icon, index) => (
                        <span key={index} className="grid size-11 place-items-center rounded-2xl border border-[#A53860]/15 bg-white text-[#670D2F] shadow-sm"><Icon size={20} weight="fill" /></span>
                      ))}
                    </div>
                    <button className="mt-6 w-full rounded-2xl bg-[#3A0519] py-3.5 text-sm font-semibold text-white">Connect with Maya</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="floating-note -left-6 top-24 hidden sm:flex">
              <span className="grid size-9 place-items-center rounded-xl bg-[#EF88AD]/20"><Sparkle weight="fill" /></span>
              <span><b>20 styles</b><small>Make it unmistakably yours</small></span>
            </div>
            <div className="floating-note -right-5 bottom-20">
              <span className="grid size-9 place-items-center rounded-xl bg-[#EF88AD]/20"><QrCode weight="bold" /></span>
              <span><b>Scan. Meet. Connect.</b><small>One QR, always current</small></span>
            </div>
          </div>
        </div>
      </section>

      <div className="ribbon" aria-label="Every Link. One Scan. Live Preview.">
        <div>
          {Array.from({ length: 8 }).map((_, index) => (
            <span key={index}>Every Link <i>✦</i> One Scan <i>✦</i> Live Preview <i>✦</i></span>
          ))}
        </div>
      </div>

      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-28 sm:px-8 lg:px-12">
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_.75fr]"><div><p className="section-kicker">How it works (အသုံးပြုပုံ)</p><h2 className="section-title max-w-3xl">From hello to shareable in three simple moments.</h2></div><p className="max-w-lg text-sm leading-7 text-muted-foreground lg:pb-2">Open an account, shape a profile that feels like you, then let one QR do the introductions. (Account ဖွင့်ပါ၊ ကိုယ်ပိုင် profile ဖန်တီးပါ၊ QR တစ်ခုတည်းနဲ့ မိတ်ဆက်လိုက်ပါ)</p></div>
        <div className="mt-12"><ProductDemoLoader /></div>
        <div className="mt-7 grid gap-3 md:grid-cols-3">{[
          ['01','Open your account','Your private studio is ready in a moment.','(ကိုယ်ပိုင် Studio ကို ခဏအတွင်း စတင်အသုံးပြုနိုင်ပါပြီ)'],
          ['02','Build what feels like you','Add your story, links, contact details, and one of 20 distinct styles.','(ကိုယ့်အကြောင်း၊ Link၊ Contact နဲ့ ပုံစံ ၂၀ ထဲက နှစ်သက်ရာထည့်ပါ)'],
          ['03','Share one lasting QR','Print it once. Your profile can keep evolving without changing the code.','(QR ကို တစ်ကြိမ်ထုတ်ရုံနဲ့ Profile ကို အချိန်မရွေး ပြင်နိုင်ပါတယ်)'],
        ].map(([number,title,copy,mm]) => <article key={number} className="rounded-3xl border bg-card p-6"><span className="text-xs font-black text-[#A53860]">{number}</span><h3 className="mt-7 font-serif text-3xl font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p><p className="mt-2 text-xs leading-5 text-[#A53860]">{mm}</p></article>)}</div>
      </section>

      <section className="bg-[#3A0519] px-5 py-28 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="section-kicker border-white/10 bg-white/5 text-[#EF88AD]">Built for working people (အလုပ်အတွက် အသင့်ရှိ)</p><h2 className="mt-6 font-serif text-6xl font-bold leading-[.85]">A business card that keeps working after the meeting ends.</h2><p className="mt-6 max-w-xl text-sm leading-7 text-white/55">Creto turns a quick introduction into a useful next step — no searching, no outdated paper card, no missed connection.</p></div><div className="grid gap-4 sm:grid-cols-2">{[
          [Briefcase,'Always presentation-ready','Look polished at a client meeting, conference, interview, or coffee chat.'],
          [ChartLineUp,'Know what lands','See profile traffic and understand when your introductions are turning into interest.'],
          [PaintBrushBroad,'Professional, never generic','Twenty art-directed styles give every role and personality a fitting home.'],
          [QrCode,'Print once, update forever','Your QR points to a stable link while everything behind it stays fresh.'],
        ].map(([Icon,title,copy]) => { const FeatureIcon = Icon as typeof Briefcase; return <article key={String(title)} className="benefit-card"><FeatureIcon size={28} weight="duotone" /><h3>{String(title)}</h3><p>{String(copy)}</p></article>; })}</div></div></div>
      </section>

      <section className="overflow-hidden px-5 py-28 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="section-kicker">Real connections (တကယ့်ချိတ်ဆက်မှုများ)</p><h2 className="section-title max-w-3xl">Small link. Big first impression.</h2></div><div className="flex gap-1 text-[#A53860]">{Array.from({length:5}).map((_,i)=><Star key={i} weight="fill" />)}</div></div></div>
        <div className="review-marquee mt-12"><div>{[
          ['Maya Bennett','Creative Director','“Creto made my introductions feel intentional. People leave a meeting with my work, not just my name.”'],
          ['Noah Kim','Product Designer','“The live preview is brilliant. I shaped the page and saw the whole story come together instantly.”'],
          ['Ari Thompson','Independent Developer','“One QR on my conference badge replaced three separate links and a lot of awkward explaining.”'],
          ['Sofia Lin','Brand Strategist','“Professional, personal, and refreshingly simple. It feels like a tiny website that actually sounds like me.”'],
          ['Maya Bennett','Creative Director','“Creto made my introductions feel intentional. People leave a meeting with my work, not just my name.”'],
          ['Noah Kim','Product Designer','“The live preview is brilliant. I shaped the page and saw the whole story come together instantly.”'],
        ].map(([name,role,quote],index)=><article key={`${name}-${index}`} className="review-card"><Quotes size={28} weight="fill" className="text-[#EF88AD]" /><p>{quote}</p><div><b>{name}</b><span>{role}</span></div></article>)}</div></div>
      </section>

      <section className="px-5 pb-28 sm:px-8 lg:px-12"><div className="mx-auto max-w-7xl overflow-hidden rounded-[2.8rem] bg-gradient-to-br from-[#3A0519] via-[#670D2F] to-[#A53860] px-6 py-20 text-center text-white shadow-[0_40px_120px_rgba(58,5,25,.25)] sm:px-12"><PaperPlaneTilt className="mx-auto text-[#EF88AD]" size={38} weight="duotone" /><h2 className="mx-auto mt-6 max-w-4xl font-serif text-[clamp(3.5rem,8vw,7.5rem)] font-bold leading-[.82] tracking-[-.05em]">Create Your Link Page Now.</h2><p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/65">Bring your work, identity, and ways to connect into one unforgettable place. (သင့်အလုပ်၊ ကိုယ်ပိုင် identity နဲ့ ဆက်သွယ်ရန်နည်းလမ်းတွေကို မှတ်မိလွယ်တဲ့ နေရာတစ်ခုထဲ စုစည်းပါ)</p><Link href="/auth" className="mt-8 inline-flex min-h-14 items-center gap-2 rounded-2xl bg-[#EF88AD] px-6 text-sm font-black text-[#3A0519] transition hover:-translate-y-1">Create your profile <ArrowUpRight /></Link></div></section>

      <footer className="border-t bg-card px-5 py-12 sm:px-8 lg:px-12"><div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.3fr_.7fr_.7fr]"><div><Link href="/" className="flex items-center gap-3"><Image src="/logo.png" alt="Creto" width={48} height={48}/><span className="font-serif text-3xl font-bold">Creto</span></Link><p className="mt-4 max-w-md text-sm leading-7 text-muted-foreground">A modern digital business card for every link, every introduction, and every next opportunity. (Link၊ မိတ်ဆက်မှုနဲ့ အခွင့်အလမ်းတိုင်းအတွက် ခေတ်မီ digital business card)</p></div><div><p className="text-xs font-black uppercase tracking-widest text-[#A53860]">Explore</p><div className="mt-4 grid gap-3 text-sm"><Link href="/creator">Creator</Link><Link href="/auth">Sign in</Link><a href="https://github.com/LaLia63" target="_blank" rel="noreferrer">GitHub</a></div></div><div><p className="text-xs font-black uppercase tracking-widest text-[#A53860]">Start</p><div className="mt-4 grid gap-3 text-sm"><Link href="/auth">Create profile</Link><a href="#how-it-works">How it works</a></div></div></div><div className="mx-auto mt-10 flex max-w-7xl flex-col gap-2 border-t pt-6 text-xs text-muted-foreground sm:flex-row sm:justify-between"><span>© 2026 Creto. All rights reserved.</span><span>Made with care by Hsu Yati Zaw.</span></div></footer>
    </main>
  );
}
