/** @format */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { useLocale } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { shippori } from '@/styles/fonts';
import { NavItem } from '@/lib/strapi';

/* ------------------------------------------------------------
   HomeBottomNav – 2-tier spec
   •  ≥1000px  : Scroll | nav links | Language
   •  700‑999px: Scroll ——— Language  (両端)
   •  <700px   : Language │ Scroll   (右寄せ)
------------------------------------------------------------ */
export default function HomeBottomNav({ className }: { className?: string }) {
  const locale = useLocale() as 'ja' | 'en';
  const [items, setItems] = useState<NavItem[]>([]);

  useEffect(() => {
    const API = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';
    fetch(`${API}/api/global?locale=${locale}&populate[nav_items]=*`)
      .then((r) => r.json())
      .then((j) => setItems(j.data?.nav_items ?? []))
      .catch((e) => console.error('[HomeBottomNav] fetch', e));
  }, [locale]);

  if (!items.length) return null;

  /* blocks */
  const ScrollBlock = (
    <div className='flex items-center gap-2 text-base'>
      <svg width='14' height='40' viewBox='0 0 14 40'>
        <path d='M7 0v34' stroke='currentColor' strokeWidth='1.5' />
        <path d='M12 29 7 34 2 29' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
      </svg>
      <span>Scroll</span>
    </div>
  );
  const LangBlock = <LanguageSwitcher />;
  const Divider = <span className='h-6 border-l border-black/80' />;

  return (
    <nav
      aria-label='Home navigation'
      className={clsx('pointer-events-none flex w-full flex-wrap items-center px-8 py-6', shippori.className, className)}
    >

      {/* 700‑999px Scroll ——— Language */}
      <div className='pointer-events-auto hidden w-full items-center justify-between gap-4 min-[700px]:flex max-[999px]:flex min-[1019px]:hidden'>
        {ScrollBlock}
        {LangBlock}
      </div>

      {/* ≥1000px full layout */}
      <div className='pointer-events-auto hidden w-full items-center min-[1020px]:flex'>
        {ScrollBlock}
        <div className='ml-auto flex items-center gap-8'>
          <ul className='flex gap-8 text-base '>
            {items.map((n) => (
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
          {LangBlock}
        </div>
      </div>
    </nav>
  );
}
