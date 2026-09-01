import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' });
const cormorant = Cormorant_Garamond({ subsets: ['latin'], variable: '--font-cormorant', weight: ['500', '600', '700'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'Creto — Everything You Are, All in One Place', template: '%s · Creto' },
  description: 'Create a beautiful digital business card, collect your links, and share your story with one memorable QR code.',
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'Creto — Everything You Are, All in One Place',
    description: 'A modern digital business card and link profile for people who make things happen.',
    type: 'website',
    images: [{ url: '/og.png', width: 1730, height: 909, alt: 'Creto — Everything You Are, All in One Place' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og.png'] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.variable} ${cormorant.variable}`}>
        <script dangerouslySetInnerHTML={{ __html: `try{if(localStorage.getItem('creto-theme')==='dark'||(!localStorage.getItem('creto-theme')&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}` }} />
        {children}
      </body>
    </html>
  );
}
