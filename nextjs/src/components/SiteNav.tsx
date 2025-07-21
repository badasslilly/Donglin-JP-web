'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import LanguageSwitcher from './LanguageSwitcher';
import { hannariMinchoFont } from '@/styles/fonts';
import Link from 'next/link';

export type Locale = 'ja' | 'en';
export interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean | null;
}

export default function SiteNav({
  locale,
  items,
  logoUrl
}: {
  locale: Locale;
  items: NavItem[];
  logoUrl?: string | null;
}) {
  const pathname = usePathname();
  const home = pathname === `/${locale}`;

  /* ----- mobile drawer state (only JS we keep) ------------------- */
  const [open, setOpen] = useState(false);

  /* ---------------- MOBILE (lg:hidden) --------------------------- */
  const mobileNav = (
    <>
      <button
        aria-label="メニュー"
        onClick={() => setOpen(!open)}
        className="fixed right-4 top-4 z-[100] flex h-10 w-10 items-center justify-center rounded-full bg-gray-900/80 text-white lg:hidden"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 right-0 z-50 w-72 max-w-full bg-stone-50 shadow-xl transition-transform duration-300 lg:hidden',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-label="モバイルメニュー"
      >
        <div
          className={`flex h-full flex-col gap-10 px-8 py-12 font-semibold ${hannariMinchoFont.className}`}
        >
          <ul className="flex flex-col gap-6 text-gray-900">
            {items.map((n) => (
              <li key={n.href}>
                {n.isExternal ? (
                  <a
                    href={n.href}
                    target="_blank"
                    rel="noopener"
                    className="block text-lg"
                    onClick={() => setOpen(false)}
                  >
                    {n.label}
                  </a>
                ) : (
                  <Link
                    href={n.href}
                    locale={locale}
                    className="block text-lg"
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
    </>
  );

  /* ---------------- DESKTOP HOME (vertical) ---------------------- */
  const verticalNav = (
    <nav
      className={clsx(
        'pointer-events-none fixed right-14 top-20 z-30 hidden lg:block',
        hannariMinchoFont.className
      )}
      aria-label="メインナビゲーション（縦書き）"
    >
      {/* <ul className="[writing-mode:vertical-rl] mix-blend-difference flex flex-col gap-6 text-[1.25rem] tracking-widest text-black pointer-events-auto"> */}
      <ul
  className={clsx(
    'pointer-events-auto flex flex-col',
    locale === 'ja'
      ? '[writing-mode:vertical-rl] gap-6 text-[1.25rem] tracking-widest mix-blend-difference text-black'
      : [
          '[writing-mode:vertical-rl]', // keep stacking top-to-bottom
          'gap-8 text-[1.25rem] tracking-widest'
        ]
  )}
>
        {items.map((n) => (
          <li key={n.href} className={clsx(
            'leading-none'
          )}>
            {n.isExternal ? (
              <a
                href={n.href}
                target="_blank"
                rel="noopener"
                className="hover:opacity-60"
              >
                {n.label}
              </a>
            ) : (
              <Link
                href={n.href}
                locale={locale}
                className="hover:opacity-60"
              >
                {n.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );

  /* ---------------- DESKTOP SUB-PAGES (horizontal) --------------- */
  const horizontalNav = (
    <header className="relative z-20 hidden lg:block">
      <nav
        className={clsx(
          'mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-6 text-base font-semibold',
          hannariMinchoFont.className
        )}
      >
        {/* left side */}
        <ul className="flex flex-1 justify-evenly gap-8">
          {items.slice(0, 3).map((n) => (
            <li key={n.href}>
              {n.isExternal ? (
                <a
                  href={n.href}
                  target="_blank"
                  rel="noopener"
                  className="hover:opacity-60"
                >
                  {n.label}
                </a>
              ) : (
                <Link
                  href={n.href}
                  locale={locale}
                  className="hover:opacity-60"
                >
                  {n.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* centre logo */}
        <Link href="/" locale={locale} className="shrink-0">
          <Image
            src={logoUrl || '/logo/logo.png'}
            alt="Donglin Temple"
            width={140}
            height={54}
            priority
          />
        </Link>

        {/* right side */}
        <ul className="flex flex-1 justify-evenly gap-8">
          {items.slice(3).map((n) => (
            <li key={n.href}>
              {n.isExternal ? (
                <a
                  href={n.href}
                  target="_blank"
                  rel="noopener"
                  className="hover:opacity-60"
                >
                  {n.label}
                </a>
              ) : (
                <Link
                  href={n.href}
                  locale={locale}
                  className="hover:opacity-60"
                >
                  {n.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );

  /* ------- Render all branches with CSS hiding ------------------- */
  return (
    <>
      {/* mobile drawer */}
      {mobileNav}

      {/* desktop navs */}
      {home ? verticalNav : horizontalNav}
    </>
  );
}
