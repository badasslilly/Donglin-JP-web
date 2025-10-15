// lib/nav.ts
import { Locale, getAboutPage, getHighlightsPage } from '@/lib/strapi';

export interface NavChild { label: string; href: string; isExternal?: boolean }
export interface NavItem  { label: string; href: string; isExternal?: boolean; children?: NavChild[] }

const isExternal = (h: string) => /^https?:\/\//i.test(h);
const stripLeadingLocale = (href: string) => href.replace(/^\/(ja|en)(?=\/|$)/, '');

function withLocale(href: string, locale: Locale) {
  if (!href) return `/${locale}`;
  if (isExternal(href)) return href;
  const clean = href.startsWith('/') ? href : `/${href}`;
  const noLocale = stripLeadingLocale(clean);
  return `/${locale}${noLocale}`.replace('//', '/');
}

export async function getNavWithChildren(locale: Locale) {
  const API = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';
  const g = await fetch(`${API}/api/global?locale=${locale}&populate[nav_items]=*`, { next: { revalidate: 60 } })
    .then(r => r.json());

  // Base items from Global
  let items: NavItem[] = (g?.data?.nav_items ?? []).map((n: any) => ({
    label: n.label,
    href: n.href,
    isExternal: n.isExternal,
  }));

  // --- Build children from Strapi tab bars ---

  // A) 東林寺について → About tabs
  const about = await getAboutPage(locale);
  const aboutChildren: NavChild[] = (about.tab_bar ?? [])
    .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
    .map((t: any) => ({
      label: t.label,
      href: withLocale(t.href, locale),
      isExternal: isExternal(t.href),
    }));

  // B) 見どころ → Highlights tabs
  const highlights = await getHighlightsPage(locale);
  const highlightChildren: NavChild[] = (highlights.tab_bar ?? [])
    .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
    .map((t: any) => ({
      label: t.label,
      href: withLocale(t.href, locale),
      isExternal: isExternal(t.href),
    }));

  // Attach children by label or path (keep it simple & robust)
  items = items.map((it) => {
    const path = stripLeadingLocale(it.href || '');
    const isAbout =
      it.label?.includes('東林寺について') || path === '/about';
    const isHighlights =
      it.label?.includes('見どころ') || path === '/highlights';

    return {
      ...it,
      href: isExternal(it.href) ? it.href : withLocale(it.href, locale),
      children: isAbout ? aboutChildren : isHighlights ? highlightChildren : undefined,
    };
  });

  return { items, logoUrl: g?.data?.logo?.url ? g.data.logo.url : null };
}
