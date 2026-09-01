'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun } from '@phosphor-icons/react';
import { useSyncExternalStore } from 'react';

const themeChangeEvent = 'creto-theme-change';

function subscribeToTheme(callback: () => void) {
  window.addEventListener(themeChangeEvent, callback);
  return () => window.removeEventListener(themeChangeEvent, callback);
}

function getThemeSnapshot() {
  return document.documentElement.classList.contains('dark');
}

function getThemeServerSnapshot() {
  return false;
}

export function SiteHeader() {
  const dark = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getThemeServerSnapshot);
  const pathname = usePathname();
  const homeActive = pathname === '/';
  const creatorActive = pathname.startsWith('/creator');

  function toggleTheme() {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('creto-theme', next ? 'dark' : 'light');
    window.dispatchEvent(new Event(themeChangeEvent));
  }

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-3 sm:top-6 sm:px-6">
      <nav className="nav-shell mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-2.5 sm:px-4" aria-label="Primary navigation">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="grid size-10 place-items-center overflow-hidden rounded-full bg-[#3A0519] shadow-sm">
            <Image src="/logo-circle.png" alt="Creto logo" width={38} height={38} className="h-9 w-9 rounded-full object-contain" />
          </span>
          <span className="font-serif text-2xl font-bold tracking-tight">Creto</span>
        </Link>
        <div className="absolute left-1/2 hidden -translate-x-1/2 rounded-full bg-[#A53860]/8 p-1 md:flex">
          <Link className={`nav-pill ${homeActive ? 'nav-pill-active' : ''}`} href="/" aria-current={homeActive ? 'page' : undefined}>Home</Link>
          <Link className={`nav-pill ${creatorActive ? 'nav-pill-active' : ''}`} href="/creator" aria-current={creatorActive ? 'page' : undefined}>Creator</Link>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} className="icon-button">
            {dark ? <Sun weight="fill" /> : <Moon weight="fill" />}
          </button>
          <Link href="/auth" className="button-primary hidden min-h-10 px-4 py-2.5 text-sm sm:inline-flex">
            Create Now <span className="hidden lg:inline">(ယခုဖန်တီးရန်)</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
