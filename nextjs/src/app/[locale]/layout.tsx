/** @format */

// src/app/[locale]/layout.tsx
import React from 'react'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { setRequestLocale, getMessages } from 'next-intl/server'

import { getGlobal, mediaURL } from '@/lib/strapi'
import type { Locale } from '@/lib/strapi'
import { getNavWithChildren } from '@/lib/nav'
import SiteNav from '@/components/SiteNav'
import { Footer } from '@/components/Footer'
import TrackOnRouteChange from '@/components/TrackOnRouteChange'
import { AudioProvider } from '@/components/audio/AudioProvider'
import GlobalGramophone from '@/components/audio/GlobalGramophone'

// -----------------------------
// Locale helpers
// -----------------------------
const ALLOWED_LOCALES = ['ja', 'en'] as const
type AppLocale = (typeof ALLOWED_LOCALES)[number]

// normalize route segment → app locales (keep your jp->ja mapping)
function normalizeLocale(l: string): AppLocale {
  const cand = l === 'jp' ? 'ja' : l
  return (ALLOWED_LOCALES as readonly string[]).includes(cand)
    ? (cand as AppLocale)
    : 'ja'
}

// Extra guard before calling Strapi
function safeLocaleForCMS(
  l: string | undefined,
  fallback: AppLocale = 'ja'
): Locale {
  const cand = (l ?? '').toLowerCase()
  return (ALLOWED_LOCALES as readonly string[]).includes(cand)
    ? (cand as Locale)
    : fallback
}

type LayoutProps = {
  children: React.ReactNode
  params: { locale: string }
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const activeLocale = normalizeLocale(params.locale)

  // v4: tell next-intl which locale this request is using
  setRequestLocale(activeLocale)

  // v4: messages can now be inferred after setRequestLocale()
  const messages = await getMessages()

  // Fetch Strapi data using a *safe* locale
  const cmsLocale: Locale = safeLocaleForCMS(activeLocale)
  const global = await getGlobal(cmsLocale)
  if (!global) notFound()

  const { items } = await getNavWithChildren(cmsLocale)
  const footerLogoUrl = mediaURL(global.footer_logo?.url)
  const hwLogo = mediaURL(global.handwritng_logo_h?.url)

  return (
    <>
      <NextIntlClientProvider locale={activeLocale} messages={messages}>
        <SiteNav locale={activeLocale} items={items} logoUrl={hwLogo} />
        <AudioProvider>
          {children}
          <GlobalGramophone />
        </AudioProvider>
      </NextIntlClientProvider>

      <Footer
        locale={activeLocale}
        opening={global.opening_hours}
        inquiry={global.inquiry}
        tel={global.phone}
        email={global.email}
        address={global.address}
        copyright={global.copyright}
        logoUrl={footerLogoUrl}
        socials={global.socials}
        mapLabel='アクセス地図を開く'
        affiliates={[
          { label: '庐山东林寺', url: 'https://www.lsdls.cn/' },
          { label: 'DONGLIN MONASTERY', url: 'https://www.donglin.org/' },
        ]}
      />
      <TrackOnRouteChange />
    </>
  )
}
