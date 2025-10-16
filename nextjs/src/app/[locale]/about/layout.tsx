
import PageTabs from "@/components/ui/PageTabs";
import HeroHeader from "@/components/ui/HeroHeader";
import { getAboutPage, mediaURL, Locale } from "@/lib/strapi";
import { cache } from "react";
import { shippori } from "@/styles/fonts";
import BorderWrapper from "@/components/ui/BorderWrapper";
import type { WithAsyncRequest } from '@/utils/next-async-props'

// Added by fix-async-props codemod
type PagePropsSync = { children: React.ReactNode; params: { locale: Locale } }
type PageProps = WithAsyncRequest<PagePropsSync>


const getShell = cache(async (locale: Locale) => {
  const about = await getAboutPage(locale);
  return {
    heroSrc: mediaURL(about.header?.bg_image?.url),
    jaTitle: about.header?.heading?.title_ja ?? "",
    enTitle: about.header?.heading?.title_en ?? "",
    tabs: (about.tab_bar ?? [])
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((t) => ({
        label: t.label,
        href: t.href.startsWith("/") ? `/${locale}${t.href}`.replace("//", "/") : t.href,
      })),
  };
});

export default async function AboutLayout(props: PageProps) {
  // Next 15 async request props shim (added by codemod)

  const { children } = props
  const { locale } = await props.params// ② await it here
    const { heroSrc, jaTitle, enTitle, tabs } = await getShell(locale);

  return (
    <div className={`min-h-screen bg-white text-gray-900 ${shippori.className} `}>
      <HeroHeader bgSrc={heroSrc} title={jaTitle} subtitle={enTitle} />
      
      {tabs.length > 0 && (
        <PageTabs
          tabs={tabs}
          className="border-y border-stone-300"
          bgClass="bg-[#e7e2d0]"
        />
      )}

      <div className="mx-auto max-w-5xl px-4 py-10">{children}</div>
    </div>
  );
}
