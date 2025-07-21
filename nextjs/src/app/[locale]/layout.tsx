// src/app/[locale]/layout.tsx
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getGlobal, mediaURL } from '@/lib/strapi';
import SiteNav  from '@/components/SiteNav';
import { Footer } from '@/components/Footer';

import type { Locale } from '@/lib/strapi';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const global   = await getGlobal(locale);
  if (!global) notFound();


  const logoUrl  = mediaURL(global.footer_logo?.url);
  const hwLogo   = mediaURL(global.handwritng_logo_h?.url);

  return (
    /* 🍃 fragment only – no <html> / <body> here */
    <>
      <NextIntlClientProvider locale={locale}>
        <SiteNav
          locale={locale}
          items={global.nav_items}
          logoUrl={hwLogo}
        />
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
        logoUrl={logoUrl}
        socials={global.socials}
        mapLabel="アクセス地図を開く"
      />
    </>
  );
}
