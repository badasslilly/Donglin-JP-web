/** @format */

// src/app/[locale]/layout.tsx
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getGlobal, mediaURL } from '@/lib/strapi'
import SiteNav from '@/components/SiteNav'
import { Footer } from '@/components/Footer'

import type { Locale } from '@/lib/strapi'
import { getNavWithChildren } from '@/lib/nav'

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const global = await getGlobal(locale)
  if (!global) notFound()
    const footerLogoUrl  = mediaURL(global.footer_logo?.url);
    const { items, logoUrl } = await getNavWithChildren(locale);
  const hwLogo = mediaURL(global.handwritng_logo_h?.url)

  return (
    /* 🍃 fragment only – no <html> / <body> here */
    <>
      <NextIntlClientProvider locale={locale}>
        <SiteNav locale={locale} items={items} logoUrl={hwLogo} />
        {children}
      </NextIntlClientProvider>

      <Footer
        locale={locale}
        opening={global.opening_hours}
        inquiry={global.inquiry}
        tel={global.phone}
        email={global.email}
        address={global.address}
        copyright={global.copyright}
        logoUrl={footerLogoUrl}
        socials={global.socials}
        mapLabel='アクセス地図を開く'
      />
    </>
  )
}
