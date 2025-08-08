/** @format */
'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { hannariMinchoFont } from '@/styles/fonts';

export type Locale = 'ja' | 'en';
export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean | null;
}

interface Props {
  locale: Locale;
  items: NavItem[];
  logoUrl?: string | null;
}

/* ------------------------------------------------------------
   SiteNav – Hotarutei‑style
   • Home page (any breakpoint) & all mobile widths: top header + drawer
   • Sub pages on ≥lg: horizontal nav bar (logo in center)
------------------------------------------------------------ */
export default function SiteNav({ locale, items, logoUrl }: Props) {
  const pathname = usePathname();
  const isHome   = pathname === `/${locale}`;
  const [open, setOpen] = useState(false);

  /* --------------------- Drawer --------------------- */
  const Drawer = (
    <>
      <aside
        className={clsx(
          'fixed inset-y-0 right-0 z-50 w-72 max-w-full bg-stone-50 shadow-xl transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-label='モバイルメニュー'
      >
        {/* close button (lined style) */}
        <button
          aria-label='Close menu'
          onClick={() => setOpen(false)}
          className='absolute right-4 top-4 flex h-10 w-10 flex-col items-center justify-center backdrop-blur-sm group cursor-pointer'
        >
          <span className='sr-only'>close</span>
          {/* two lines forming X */}
          <span className='block h-[1.5px] w-8 origin-center rotate-30 bg-black/80 transition-transform duration-300 group-hover:w-7' />
          <span className='block h-[1.5px] w-8 origin-center -rotate-30 -translate-y-[2px] bg-black/80 transition-transform duration-300 group-hover:w-7' />
        </button>

        <div className={clsx('flex h-full flex-col gap-10 px-8 py-14 font-medium', hannariMinchoFont.className)}>
        <ul className='flex flex-col gap-6 text-lg text-gray-900 mt-12'>
            {items.map((n) => (
              <li key={n.href}>
                {n.isExternal ? (
                  <a
                    href={n.href}
                    target='_blank'
                    rel='noopener'
                    className='block transition-all duration-200 hover:translate-x-1 hover:text-gray-600'
                    onClick={() => setOpen(false)}
                  >
                    {n.label}
                  </a>
                ) : (
                  <Link
                    href={n.href}
                    locale={locale}
                    className='block transition-all duration-200 hover:translate-x-1 hover:text-gray-600'
                    onClick={() => setOpen(false)}
                  >
                    {n.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <LanguageSwitcher />
        </div>
      </aside>

      {/* backdrop */}
      {open && <div className='fixed inset-0 z-40 bg-black/60 lg:hidden' onClick={() => setOpen(false)} />}
    </>
  );

  /* --------------------- Top Header (home + mobile) --------------------- */
  const TopHeader = (
    <header className='fixed top-0 left-0 right-0 z-50'>
      <nav
        className={clsx(
          'mx-auto flex max-w-8xl items-center justify-between px-4 py-4 md:px-8', !isHome && 'lg:hidden',
          hannariMinchoFont.className
        )}
      >
        {/* Logo + vertical text */}
        <Link href='/' locale={locale} className='shrink-0 cursor-pointer'>
          <div className='flex items-center gap-2'>
            <Image src='/logo/avatar.png' alt='Donglin Monastery crest' width={44} height={44} priority />
            <div className='leading-tight'>
              <Image src={logoUrl || '/logo/logo.png'} alt='東林寺' width={100} height={150} priority className='h-auto w-20' />
            </div>
          </div>
        </Link>

        {/* MENU button */}
        <button
          onClick={() => setOpen(!open)}
          aria-label='メニュー'
          className='group flex flex-col items-center justify-center h-12 w-12 text-black text-[10px] backdrop-blur-sm transition-transform duration-200 hover:scale-105 mix-blend-difference cursor-pointer'
        >
          <div className='w-8 border-t border-current mb-[5px] transition-all duration-300 group-hover:w-7' />
          <div className='w-8 border-t border-current mb-[2px] transition-all duration-300 group-hover:w-7' />
          <span className='mt-1 tracking-widest font-bold'>MENU</span>
        </button>
      </nav>
      {Drawer}
    </header>
  );

  /* --------------------- Horizontal Nav (sub pages ≥lg) -------------- */
  const HorizontalNav = (
    <header className='relative z-20 hidden lg:block'>
      <nav
        className={clsx(
          'mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-6 text-base font-semibold',
          hannariMinchoFont.className
        )}
      >
        {/* left */}
        <ul className='flex flex-1 justify-evenly gap-8'>
          {items.slice(0, 3).map((n) => (
            <li key={n.href}>
              {n.isExternal ? (
                <a href={n.href} target='_blank' rel='noopener' className='hover:opacity-60'>
                  {n.label}
                </a>
              ) : (
                <Link href={n.href} locale={locale} className='hover:opacity-60'>
                  {n.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* centre logo */}
        <Link href='/' locale={locale} className='shrink-0'>
          <Image src={logoUrl || '/logo/logo.png'} alt='Donglin Temple' width={140} height={54} priority />
        </Link>

        {/* right */}
        <ul className='flex flex-1 justify-evenly gap-8'>
          {items.slice(3).map((n) => (
            <li key={n.href}>
              {n.isExternal ? (
                <a href={n.href} target='_blank' rel='noopener' className='hover:opacity-60'>
                  {n.label}
                </a>
              ) : (
                <Link href={n.href} locale={locale} className='hover:opacity-60'>
                  {n.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );

  /* --------------------- Render --------------------- */
  return (
    <>
    {/* Header: Home (全幅) + サブページのモバイル */}
    {TopHeader}

    {/* Horizontal nav: サブページ ≥ lg */}
    {!isHome && HorizontalNav}
  </>
  );
}
