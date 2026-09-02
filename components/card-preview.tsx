import type { ComponentType } from 'react';
import Image from 'next/image';
import {
  EnvelopeSimpleIcon as EnvelopeSimple,
  FacebookLogoIcon as FacebookLogo,
  GithubLogoIcon as GithubLogo,
  GlobeSimpleIcon as GlobeSimple,
  InstagramLogoIcon as InstagramLogo,
  LinkedinLogoIcon as LinkedinLogo,
  PaperPlaneTiltIcon as PaperPlaneTilt,
  PhoneIcon as Phone,
  TiktokLogoIcon as TiktokLogo,
} from '@phosphor-icons/react/dist/ssr';
import type { CardStyle, CretoProfile, SocialLink, SocialPlatform } from '@/lib/creto';

const iconMap: Record<SocialPlatform, ComponentType<{ size?: number; weight?: 'fill' | 'bold' }>> = {
  facebook: FacebookLogo,
  instagram: InstagramLogo,
  linkedin: LinkedinLogo,
  github: GithubLogo,
  tiktok: TiktokLogo,
  telegram: PaperPlaneTilt,
  website: GlobeSimple,
};

const looks: Record<CardStyle, { surface: string; ink: string; muted: string; accent: string; button: string; avatar: string; layout: 'center' | 'left' | 'split'; font: string }> = {
  minimal: { surface: '#fffdfd', ink: '#3A0519', muted: '#815b69', accent: '#A53860', button: '#3A0519', avatar: '50%', layout: 'center', font: 'var(--font-manrope)' },
  elegant: { surface: '#fdf3f6', ink: '#3A0519', muted: '#7f455a', accent: '#A53860', button: '#670D2F', avatar: '50%', layout: 'center', font: 'var(--font-cormorant)' },
  glass: { surface: '#4a0b24', ink: '#fff5f8', muted: '#efbdd0', accent: '#EF88AD', button: '#EF88AD', avatar: '28%', layout: 'center', font: 'var(--font-manrope)' },
  editorial: { surface: '#f8eee7', ink: '#3A0519', muted: '#7b5360', accent: '#A53860', button: '#3A0519', avatar: '2%', layout: 'left', font: 'var(--font-cormorant)' },
  creative: { surface: '#EF88AD', ink: '#3A0519', muted: '#670D2F', accent: '#670D2F', button: '#3A0519', avatar: '36% 64% 48% 52%', layout: 'split', font: 'var(--font-manrope)' },
  botanical: { surface: '#fffaf2', ink: '#3A0519', muted: '#79605f', accent: '#A53860', button: '#670D2F', avatar: '50% 46% 52% 44%', layout: 'center', font: 'var(--font-cormorant)' },
  midnight: { surface: '#16020a', ink: '#fff4f7', muted: '#d5a4b6', accent: '#EF88AD', button: '#A53860', avatar: '50%', layout: 'center', font: 'var(--font-manrope)' },
  'soft-rose': { surface: '#fce8ef', ink: '#670D2F', muted: '#986277', accent: '#A53860', button: '#A53860', avatar: '38%', layout: 'center', font: 'var(--font-cormorant)' },
  professional: { surface: '#ffffff', ink: '#3A0519', muted: '#756068', accent: '#670D2F', button: '#670D2F', avatar: '18%', layout: 'left', font: 'var(--font-manrope)' },
  developer: { surface: '#1d0710', ink: '#fce9f0', muted: '#cf8da5', accent: '#EF88AD', button: '#670D2F', avatar: '8%', layout: 'left', font: 'ui-monospace, monospace' },
  business: { surface: '#f7f2f4', ink: '#3A0519', muted: '#6e5961', accent: '#670D2F', button: '#3A0519', avatar: '50%', layout: 'split', font: 'var(--font-manrope)' },
  mono: { surface: '#fff', ink: '#140108', muted: '#555', accent: '#111', button: '#111', avatar: '0', layout: 'center', font: 'ui-monospace, monospace' },
  gradient: { surface: '#670D2F', ink: '#fff7fa', muted: '#f5c9d9', accent: '#EF88AD', button: '#fff7fa', avatar: '50%', layout: 'center', font: 'var(--font-manrope)' },
  organic: { surface: '#fff6f7', ink: '#3A0519', muted: '#8b586b', accent: '#A53860', button: '#670D2F', avatar: '43% 57% 61% 39%', layout: 'center', font: 'var(--font-cormorant)' },
  modern: { surface: '#f8f4f5', ink: '#3A0519', muted: '#725762', accent: '#A53860', button: '#A53860', avatar: '12%', layout: 'left', font: 'var(--font-manrope)' },
  luxury: { surface: '#26040f', ink: '#fff5f8', muted: '#dbadbd', accent: '#EF88AD', button: '#EF88AD', avatar: '50%', layout: 'center', font: 'var(--font-cormorant)' },
  neon: { surface: '#100107', ink: '#fff', muted: '#f0b6ca', accent: '#ff4f9a', button: '#ff4f9a', avatar: '20%', layout: 'center', font: 'var(--font-manrope)' },
  retro: { surface: '#f8dfe2', ink: '#3A0519', muted: '#713e50', accent: '#A53860', button: '#670D2F', avatar: '50%', layout: 'left', font: 'ui-monospace, monospace' },
  playful: { surface: '#fff3f7', ink: '#3A0519', muted: '#905166', accent: '#A53860', button: '#A53860', avatar: '40% 60% 45% 55%', layout: 'center', font: 'var(--font-manrope)' },
  brutalist: { surface: '#fff', ink: '#160208', muted: '#4f3540', accent: '#A53860', button: '#160208', avatar: '0', layout: 'left', font: 'Arial Black, sans-serif' },
};

function Artwork({ style }: { style: CardStyle }) {
  const common = { className: 'pointer-events-none absolute inset-0 h-full w-full', viewBox: '0 0 400 680', preserveAspectRatio: 'none' };
  switch (style) {
    case 'minimal': return <svg {...common}><path d="M0 92H400" stroke="#A53860" opacity=".18"/><circle cx="350" cy="44" r="16" fill="#EF88AD" opacity=".45"/></svg>;
    case 'elegant': return <svg {...common}><path d="M-20 140C120 20 240 260 420 80" fill="none" stroke="#A53860" opacity=".16" strokeWidth="2"/><path d="M20 610Q200 520 380 610" fill="none" stroke="#A53860" opacity=".22"/></svg>;
    case 'glass': return <svg {...common}><defs><linearGradient id="g" x2="1" y2="1"><stop stopColor="#EF88AD"/><stop offset="1" stopColor="#3A0519"/></linearGradient></defs><rect width="400" height="680" fill="url(#g)"/><circle cx="80" cy="100" r="120" fill="#fff" opacity=".08"/><circle cx="370" cy="560" r="170" fill="#A53860" opacity=".32"/></svg>;
    case 'editorial': return <svg {...common}><rect x="28" y="24" width="7" height="632" fill="#A53860"/><text x="374" y="56" textAnchor="end" fontSize="10" fill="#670D2F">VOL. 01 / CRETO</text><path d="M60 580H370" stroke="#3A0519"/></svg>;
    case 'creative': return <svg {...common}><path d="M0 0H400V170L0 310Z" fill="#A53860" opacity=".46"/><circle cx="335" cy="575" r="92" fill="#670D2F" opacity=".22"/><rect x="300" y="34" width="60" height="60" rx="16" fill="#3A0519" opacity=".14"/></svg>;
    case 'botanical': return <svg {...common}><g fill="none" stroke="#A53860" opacity=".27"><path d="M32 670Q30 420 140 280"/><path d="M70 520q-50-40-42-82M84 460q52-30 70-80M50 588q70-22 94-79"/><path d="M350 0q-30 120-120 188"/></g></svg>;
    case 'midnight': return <svg {...common}><circle cx="320" cy="80" r="180" fill="#A53860" opacity=".2"/><g fill="#EF88AD">{[[44,90],[320,180],[80,520],[352,570],[250,42]].map(([x,y])=><circle key={`${x}${y}`} cx={x} cy={y} r="2"/>)}</g><path d="M0 610C100 540 280 700 400 580V680H0Z" fill="#670D2F" opacity=".45"/></svg>;
    case 'soft-rose': return <svg {...common}><circle cx="0" cy="0" r="180" fill="#EF88AD" opacity=".25"/><circle cx="400" cy="680" r="210" fill="#A53860" opacity=".13"/><path d="M50 620C160 500 250 660 370 530" fill="none" stroke="#A53860" opacity=".18" strokeWidth="18"/></svg>;
    case 'professional': return <svg {...common}><rect width="400" height="112" fill="#670D2F"/><rect y="112" width="400" height="8" fill="#EF88AD"/><path d="M34 610H366" stroke="#670D2F" opacity=".2"/></svg>;
    case 'developer': return <svg {...common}><g fill="#EF88AD" opacity=".09" fontFamily="monospace" fontSize="14"><text x="20" y="50">{'{ profile: true }'}</text><text x="250" y="640">{'</hello>'}</text><text x="25" y="620">01 10 11</text></g><path d="M20 82H380" stroke="#EF88AD" opacity=".18" strokeDasharray="4 8"/></svg>;
    case 'business': return <svg {...common}><rect width="150" height="680" fill="#670D2F" opacity=".08"/><path d="M150 0V680" stroke="#670D2F" opacity=".18"/><rect x="330" y="30" width="40" height="5" fill="#A53860"/></svg>;
    case 'mono': return <svg {...common}><rect x="18" y="18" width="364" height="644" fill="none" stroke="#111" strokeWidth="2"/><circle cx="355" cy="46" r="8" fill="#111"/><path d="M18 540H382" stroke="#111"/></svg>;
    case 'gradient': return <svg {...common}><defs><linearGradient id="gg" x1="0" x2="1" y1="1" y2="0"><stop stopColor="#3A0519"/><stop offset=".55" stopColor="#A53860"/><stop offset="1" stopColor="#EF88AD"/></linearGradient></defs><rect width="400" height="680" fill="url(#gg)"/><path d="M0 170C130 80 250 240 400 120" stroke="#fff" opacity=".15" fill="none" strokeWidth="80"/></svg>;
    case 'organic': return <svg {...common}><path d="M-60 110C70-50 250 10 300 115S480 240 420 350" fill="#EF88AD" opacity=".18"/><path d="M-40 610C80 470 200 740 440 530V720H-20Z" fill="#A53860" opacity=".11"/></svg>;
    case 'modern': return <svg {...common}><path d="M0 100H400M0 220H400M0 340H400M0 460H400M0 580H400M100 0V680M200 0V680M300 0V680" stroke="#670D2F" opacity=".06"/><rect x="26" y="26" width="70" height="9" fill="#A53860"/></svg>;
    case 'luxury': return <svg {...common}><rect x="24" y="24" width="352" height="632" rx="180" fill="none" stroke="#EF88AD" opacity=".32"/><circle cx="200" cy="340" r="176" fill="none" stroke="#EF88AD" opacity=".09"/><path d="M150 44H250" stroke="#EF88AD"/></svg>;
    case 'neon': return <svg {...common}><defs><filter id="glow"><feGaussianBlur stdDeviation="8"/></filter></defs><path d="M-20 160L420 20M-10 650L430 510" stroke="#ff4f9a" strokeWidth="9" opacity=".5" filter="url(#glow)"/><path d="M-20 160L420 20M-10 650L430 510" stroke="#ff4f9a" strokeWidth="2"/><circle cx="330" cy="330" r="120" fill="#A53860" opacity=".12"/></svg>;
    case 'retro': return <svg {...common}><defs><pattern id="check" width="28" height="28" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#A53860"/><rect x="14" y="14" width="14" height="14" fill="#A53860"/></pattern></defs><rect y="0" width="400" height="70" fill="url(#check)" opacity=".3"/><circle cx="350" cy="610" r="80" fill="#A53860" opacity=".13"/></svg>;
    case 'playful': return <svg {...common}><circle cx="40" cy="80" r="46" fill="#EF88AD" opacity=".55"/><rect x="310" y="40" width="58" height="58" rx="20" fill="#A53860" opacity=".25" transform="rotate(14 339 69)"/><path d="M0 600q100-80 200 0t200 0v80H0Z" fill="#EF88AD" opacity=".28"/></svg>;
    case 'brutalist': return <svg {...common}><rect x="8" y="8" width="384" height="664" fill="none" stroke="#160208" strokeWidth="7"/><path d="M0 138H400M0 550H400" stroke="#160208" strokeWidth="7"/><rect x="310" y="18" width="70" height="28" fill="#A53860"/></svg>;
  }
}

export function CardPreview({ profile, links, compact = false, interactive = false }: { profile: CretoProfile; links: SocialLink[]; compact?: boolean; interactive?: boolean }) {
  const look = looks[profile.card_style] || looks.minimal;
  const left = look.layout === 'left' || look.layout === 'split';
  const isDarkButton = ['glass','midnight','gradient','luxury','neon'].includes(profile.card_style);
  return (
    <article
      className={`relative isolate flex w-full overflow-hidden shadow-[0_28px_80px_rgba(58,5,25,.20)] ${compact ? 'min-h-[480px] rounded-[1.6rem]' : 'min-h-[650px] rounded-[2.1rem]'}`}
      style={{ background: look.surface, color: look.ink, fontFamily: look.font, border: profile.card_style === 'brutalist' ? '4px solid #160208' : '1px solid rgba(165,56,96,.16)' }}
    >
      <Artwork style={profile.card_style} />
      <div className={`relative z-10 flex w-full flex-col ${left ? 'items-start text-left' : 'items-center text-center'} ${compact ? 'p-7 pt-12' : 'p-9 pt-16'}`}>
        {profile.card_style === 'developer' && <p className="mb-6 text-xs" style={{ color: look.accent }}>~/creto/profile $</p>}
        <div className={`${compact ? 'size-24' : 'size-32'} relative overflow-hidden border-4 shadow-xl`} style={{ borderRadius: look.avatar, borderColor: look.accent, background: `${look.accent}32` }}>
          {profile.avatar_data_url ? <Image src={profile.avatar_data_url} alt={profile.name || 'Profile'} fill unoptimized className="object-cover" /> : <div className="grid h-full w-full place-items-center text-3xl font-bold" style={{ color: look.accent }}>{(profile.name || 'Y').slice(0,1).toUpperCase()}</div>}
        </div>
        <div className={left ? 'w-full' : 'w-full max-w-sm'}>
          <p className="mt-7 text-[10px] font-extrabold uppercase tracking-[.22em]" style={{ color: look.accent }}>Digital profile · Creto</p>
          <h1 className={`${compact ? 'text-4xl' : 'text-5xl'} mt-3 font-bold leading-[.95] tracking-[-.04em]`}>{profile.name || 'Your Name'}</h1>
          <p className="mt-4 text-sm leading-6" style={{ color: look.muted }}>{profile.bio || 'A short introduction about the work you do and the value you bring.'}</p>
        </div>
        <div className={`mt-7 flex flex-wrap gap-2 ${left ? '' : 'justify-center'}`}>
          {links.length ? links.map((link) => {
            const Icon = iconMap[link.platform];
            const Tag = interactive ? 'a' : 'span';
            return <Tag key={`${link.platform}-${link.position}`} {...(interactive ? { href: link.url, target: '_blank', rel: 'noreferrer' } : {})} className="grid size-11 place-items-center rounded-2xl border transition-transform hover:-translate-y-1" style={{ color: look.ink, borderColor: `${look.accent}48`, background: `${look.accent}18` }} aria-label={link.platform}><Icon size={20} weight="fill" /></Tag>;
          }) : <span className="rounded-full border px-4 py-2 text-xs" style={{ color: look.muted, borderColor: `${look.accent}3d` }}>Your links will appear here</span>}
        </div>
        <div className={`mt-auto grid w-full gap-2 pt-9 ${profile.email && profile.phone ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {profile.email && <a href={interactive ? `mailto:${profile.email}` : undefined} className="flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-xs font-bold" style={{ borderColor: `${look.accent}45` }}><EnvelopeSimple /> Email</a>}
          {profile.phone && <a href={interactive ? `tel:${profile.phone}` : undefined} className="flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-xs font-bold" style={{ borderColor: `${look.accent}45` }}><Phone /> Call</a>}
          {!profile.email && !profile.phone && <span className="rounded-xl border px-3 py-3 text-center text-xs" style={{ color: look.muted, borderColor: `${look.accent}35` }}>Add contact details to make connecting effortless</span>}
        </div>
        <div className="mt-3 w-full rounded-xl px-4 py-3 text-center text-xs font-extrabold" style={{ background: look.button, color: isDarkButton ? '#3A0519' : '#fff7fa', border: profile.card_style === 'brutalist' ? '3px solid #160208' : 'none' }}>Let’s connect (ဆက်သွယ်ကြမယ်)</div>
      </div>
    </article>
  );
}

export function TemplateSwatch({ style }: { style: CardStyle }) {
  const look = looks[style];
  return <div className="relative h-28 overflow-hidden rounded-xl border" style={{ background: look.surface, color: look.ink }}><Artwork style={style}/><div className="absolute left-4 top-5 size-8 rounded-full border-2" style={{ borderColor: look.accent }}/><div className="absolute bottom-5 left-4 h-2 w-20 rounded-full" style={{ background: look.ink }}/><div className="absolute bottom-2.5 left-4 h-1.5 w-12 rounded-full opacity-40" style={{ background: look.muted }}/></div>;
}
