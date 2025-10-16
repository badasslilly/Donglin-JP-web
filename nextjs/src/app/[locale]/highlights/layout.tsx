import HeroHeader  from "@/components/ui/HeroHeader";
import PageTabs    from "@/components/ui/PageTabs";
import { getHighlightsPage, mediaURL, Locale } from "@/lib/strapi";
import { shippori } from "@/styles/fonts";
import { cache } from "react";
import React from "react";
;

/* ——— cache shell so /highlights/* children reuse the fetch ——— */
const getHighlightsShell = cache(async (locale: Locale) => {
  const page = await getHighlightsPage(locale);
  return {
    heroSrc: mediaURL(page.header?.bg_image?.url),
    jaTitle: page.header?.heading?.title_ja ?? "",
    enTitle: page.header?.heading?.title_en ?? "",
    tabs: (page.tab_bar ?? [])
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((t) => ({
        label: t.label,
        href: t.href.startsWith("/")
          ? `/${locale}${t.href}`.replace("//", "/")
          : t.href,
      })),
  };
});

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: 'ja' | 'en' }>;
}

export default async function HighlightsLayout(props: LayoutProps) {
  const { children } = props;
  const { locale } = await props.params;

  const { heroSrc, jaTitle, enTitle, tabs } = await getHighlightsShell(locale);

  return (
    <div className={`min-h-screen bg-white text-gray-900 ${shippori.className} font-semibold`}>
      <HeroHeader bgSrc={heroSrc} title={jaTitle} subtitle={enTitle} />
      {tabs.length > 0 && (
        <PageTabs
          tabs={tabs}
          className="border-b border-stone-300"
          bgClass="bg-[#e7e2d0]"
        />
      )}
      <div className="">{children}</div>
    </div>
  );
}
