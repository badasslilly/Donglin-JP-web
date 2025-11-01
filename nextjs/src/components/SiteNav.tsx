/** @format */
// components/SiteNav.tsx
'use client';

import {useEffect, useRef, useState} from 'react';
import {usePathname} from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

import LanguageSwitcher from '@/components/LanguageSwitcher';
import {hannariMinchoFont} from '@/styles/fonts/fonts';
import type {Locale, NavItem} from '@/lib/strapi';
import {localeHref} from '@/lib/localeHref';

interface Props {
  locale: Locale;
  items: NavItem[];
  logoUrl?: string | null;
}

export default function SiteNav({locale, items, logoUrl}: Props) {
  const pathname = usePathname();
  const isHome = pathname === `/${locale}`;

  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const [isLightBg, setIsLightBg] = useState(!isHome);

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>('[data-hero]');
    if (!hero) {
      setIsLightBg(true);
      return;
    }
    const update = () => {
      const headerH = headerRef.current?.offsetHeight ?? 64;
      const rect = hero.getBoundingClientRect();
      setIsLightBg(rect.bottom <= headerH);
    };
    update();
    window.addEventListener('scroll', update, {passive: true});
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [isHome]);

  /* ---------- Mobile Drawer ---------- */
  const Drawer = (
    <>
      <aside
        className={clsx(
          'fixed inset-y-0 right-0 z-50 w-80 max-w-full bg-stone-50 shadow-xl transition-transform duration-300',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
        aria-label="モバイルメニュー"
      >
        <button
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 flex h-10 w-10 flex-col items-center justify-center backdrop-blur-sm group"
        >
          <span className="sr-only">close</span>
          <span className="block h-[1.5px] w-8 origin-center rotate-30 bg-black/80 transition-all group-hover:w-7" />
          <span className="block h-[1.5px] w-8 origin-center -rotate-30 -translate-y-[2px] bg-black/80 transition-all group-hover:w-7" />
        </button>

        <div
          className={clsx(
            'flex h-full flex-col gap-8 px-8 py-14',
            hannariMinchoFont.className
          )}
        >
          <ul className="mt-8 space-y-4 text-lg text-gray-900">
            {items.map((n) => (
              <li key={n.href}>
                {n.isExternal ? (
                  <a
                    href={n.href}
                    target="_blank"
                    rel="noopener"
                    className="hover:opacity-70"
                    onClick={() => setOpen(false)}
                  >
                    {n.label}
                  </a>
                ) : (
                  <Link
                    href={localeHref(n.href, locale)}
                    className="hover:opacity-70"
                    onClick={() => setOpen(false)}
                  >
                    {n.label}
                  </Link>
                )}

                {!!n.children?.length && (
                  <ul className="space-y-3 py-2 text-[15px]">
                    {n.children.map((c) => (
                      <li key={c.href} className="flex items-baseline gap-2">
                        <span aria-hidden>-</span>
                        {c.isExternal ? (
                          <a
                            href={c.href}
                            target="_blank"
                            rel="noopener"
                            className="hover:opacity-70"
                            onClick={() => setOpen(false)}
                          >
                            {c.label}
                          </a>
                        ) : (
                          <Link
                            href={localeHref(c.href, locale)}
                            className="hover:opacity-70"
                            onClick={() => setOpen(false)}
                          >
                            {c.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <LanguageSwitcher />
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );

  /* ---------- Top header (home + mobile) ---------- */
  const menuColor = isLightBg ? 'text-black' : 'text-white/90';
  const glassLogo = clsx('backdrop-blur-sm rounded px-2 py-1', isLightBg ? '' : 'bg-black/5');

  const TopHeader = (
    <header ref={headerRef} className="fixed top-0 left-0 right-0 z-50">
      <nav
        className={clsx(
          'mx-auto flex max-w-8xl items-center justify-between px-4 py-4 md:px-8',
          !isHome && 'lg:hidden',
          hannariMinchoFont.className
        )}
      >
        <Link href={`/${locale}`} className="shrink-0">
          <div className={clsx('flex items-center gap-2', glassLogo)}>
            <Image
              src="/logo/avatar.png"
              alt="Donglin Monastery crest"
              width={44}
              height={44}
              priority
            />
            <Image
              src={logoUrl || '/logo/logo.png'}
              alt="東林寺"
              width={100}
              height={150}
              priority
              className="h-auto w-20"
            />
          </div>
        </Link>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="メニュー"
          className={clsx(
            'group flex h-12 w-12 flex-col items-center justify-center rounded text-[10px] backdrop-blur-sm',
            menuColor
          )}
        >
          <div className="w-8 border-t border-current mb-[5px] transition-all group-hover:w-7" />
          <div className="w-8 border-t border-current mb-[2px] transition-all group-hover:w-7" />
          <span className="mt-1 tracking-widest font-bold">MENU</span>
        </button>
      </nav>
      {Drawer}
    </header>
  );

  /* ---------- Desktop horizontal nav with dropdowns ---------- */
  const HorizontalNav = (
    <header className="relative z-20 hidden lg:block">
      <nav
        className={clsx(
          'mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-6 text-[17px] font-semibold',
          hannariMinchoFont.className
        )}
      >
        {/* Left group */}
        <ul className="flex flex-1 justify-evenly gap-8">
          {items.slice(0, 3).map((n) => (
            <li key={n.href} className="relative group">
              <NavParent locale={locale} item={n} />
            </li>
          ))}
        </ul>

        {/* Center logo */}
        <Link href={`/${locale}`} className="shrink-0">
          <Image
            src={logoUrl || '/logo/logo.png'}
            alt="Donglin Temple"
            width={140}
            height={54}
            priority
          />
        </Link>

        {/* Right group */}
        <ul className="flex flex-1 justify-evenly gap-8">
          {items.slice(3).map((n) => (
            <li key={n.href} className="relative group">
              <NavParent locale={locale} item={n} />
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );

  return (
    <>
      {TopHeader}
      {!isHome && HorizontalNav}
    </>
  );
}

/* ---------- Parent with dropdown panel ---------- */
function NavParent({item, locale}: {item: NavItem; locale: Locale}) {
  const hasChildren = !!item.children?.length;

  const ParentLabel = item.isExternal ? (
    <a href={item.href} target="_blank" rel="noopener" className="hover:opacity-60">
      {item.label}
    </a>
  ) : (
    <Link href={localeHref(item.href, locale)} className="hover:opacity-60">
      {item.label}
    </Link>
  );

  return (
    <>
      {ParentLabel}

      {hasChildren && (
        <div
          className={clsx(
            'pointer-events-none absolute left-1/2 top-full -translate-x-1/2 pt-3 opacity-0',
            'transition-opacity duration-150 ease-out',
            'group-hover:opacity-100 group-hover:pointer-events-auto focus-within:opacity-100 focus-within:pointer-events-auto'
          )}
        >
          <div className="rounded-2xl border border-stone-200 bg-white/95 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.08)] px-6 py-5">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-2 min-w-[280px]">
              {item.children!.map((c) => (
                <li key={c.href} className="text-[15px]">
                  {c.isExternal ? (
                    <a href={c.href} target="_blank" rel="noopener" className="hover:opacity-70">
                      {c.label}
                    </a>
                  ) : (
                    <Link href={localeHref(c.href, locale)} className="hover:opacity-70">
                      {c.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}

