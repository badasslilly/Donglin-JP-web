/** @format */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import clsx from 'clsx'
import localFont from 'next/font/local'
import LanguageSwitcher from './LanguageSwitcher'
import Image from 'next/image'

/* ------------------------------------------------------------------ */
/*  VerticalSiteNav – home rail & sub‑page bar                        */
/* ------------------------------------------------------------------ */
const hannari = localFont({ src: '../app/fonts/HannariMincho-Regular.woff2' })

const NAV = [
  { href: '/', label: 'トップ' },
  { href: '/about', label: '東林寺について' },
  { href: '/highlights', label: '見どころ' },
  { href: '/events', label: '行事・体験' },
  { href: '/offering', label: '授与品一覧' },
  { href: '/news', label: 'お知らせ' },
  { href: '/contact', label: 'お問い合わせ' },
]

export default function SiteNav() {
  const pathname = usePathname()

  /* breakpoint */
  const [desktop, setDesktop] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return // SSR guard
    const mq = matchMedia('(min-width:1024px)')
    const handler = () => setDesktop(mq.matches)
    handler()
    mq.addEventListener('change', handler)
    return () => {
      mq.removeEventListener('change', handler)
    }
  }, [])

  const mobile = !desktop
  const home = pathname === '/'

  /* sidebar (mobile) */
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (mobile) {
      setOpen(false)
    }
  }, [pathname, mobile])

  /* ─────────────── Mobile hamburger & sidebar ─────────────── */
  if (mobile) {
    return (
      <>
        <button
          aria-label='メニュー'
          onClick={() => setOpen((o) => !o)}
          className='fixed right-4 top-4 z-[100] flex h-10 w-10 items-center justify-center rounded-full bg-gray-900/80 text-white'
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        {open && (
          <div
            className='fixed inset-0 z-40 bg-black/60'
            onClick={() => setOpen(false)}
          />
        )}

        <aside
          className={clsx(
            'fixed inset-y-0 right-0 z-50 w-72 max-w-full bg-stone-50 shadow-xl transition-transform duration-300',
            open ? 'translate-x-0' : 'translate-x-full'
          )}
          aria-label='メインナビゲーション'
        >
          <div className='flex h-full flex-col gap-10 px-8 py-12'>
            <ul className='flex flex-col gap-6 font-medium text-gray-900'>
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className='block text-lg'
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
            <LanguageSwitcher lang='ja' />
          </div>
        </aside>
      </>
    )
  }

  /* ─────────────── Desktop HOME: vertical rail ────────────── */
  if (home && desktop) {
    return (
      <nav
        className={clsx(
          'fixed right-14 top-20 z-30 pointer-events-none',
          hannari.className
        )}
        aria-label='メインナビゲーション（縦書き）'
      >
        <ul className='flex flex-col gap-8 text-[1.25rem] tracking-widest text-black [writing-mode:vertical-rl] mix-blend-difference'>
          {NAV.map((n) => (
            <li key={n.href} className='leading-none'>
              <Link
                href={n.href}
                className='pointer-events-auto hover:opacity-60'
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    )
  }

  /* ─────────────── Desktop sub‑pages: horizontal bar ───────── */
  if (desktop) {
    return (
      <header className="relative z-20">
        <nav
          className={clsx(
            "mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-6 text-base font-semibold",
            hannari.className
          )}
        >
          {/* left group */}
          <ul className="flex flex-1 justify-evenly gap-8">
            {NAV.slice(1, 4).map((n) => (
              <li key={n.href} className="flex flex-col items-center gap-1">
                {/* <span className="h-1 w-1 rounded-full bg-black/60" /> */}
                <Link href={n.href} className="hover:opacity-60">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* centre logo */}
          <Link href="/" className="shrink-0">
            <Image src="/logo/donglin-logo.png" alt="中国・廬山東林寺" width={140} height={54} priority />
          </Link>

          {/* right group */}
          <ul className="flex flex-1 justify-evenly gap-8">
            {NAV.slice(4).map((n) => (
              <li key={n.href} className="flex flex-col items-center gap-1">
                {/* <span className="h-1 w-1 rounded-full bg-black/60" /> */}
                <Link href={n.href} className="hover:opacity-60">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    );
  }

  /* desktop non‑home fall‑back (shouldn't reach) */
  return null
}
