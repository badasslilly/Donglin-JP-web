/** @format */

import { BlocksContent } from "@strapi/blocks-react-renderer";
import { notFound } from "next/navigation";
import qs from "qs";
import { cache } from "react";

/* ------------------------------------------------------------------ */
/*  ENV – set these in .env                                           */
/* ------------------------------------------------------------------ */
const PUBLIC   = process.env.NEXT_PUBLIC_STRAPI_URL!;  
const INTERNAL = (process.env.STRAPI_INTERNAL_URL || PUBLIC).replace(/\/+$/, ""); // e.g. http://127.0.0.1:1337
const TOKEN    = process.env.STRAPI_TOKEN!;                                       // read-only API token
const IS_PROD  = process.env.NODE_ENV === "production";

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */
export type Locale = "ja" | "en";

function toQuery(obj: object) {
  return qs.stringify(obj, { encodeValuesOnly: true, arrayFormat: "repeat" });
}

/* ------------------------------------------------------------------ */
/*  Core fetch helper with smart caching (ISR)                         */
/* ------------------------------------------------------------------ */
type StrapiFetchOpts = {
  /** Revalidation window in seconds; set 0 for per-request (avoid unless you must). */
  revalidate?: number;
  /** Cache tags for on-demand invalidation (Next.js cache tags). */
  tags?: string[];
  /** Extra headers if needed. */
  headers?: Record<string, string>;
  /** Force PUBLIC or INTERNAL (auto-picks based on server/client by default). */
  base?: "public" | "internal";
};

export async function strapiFetch<T = unknown>(path: string, opts: StrapiFetchOpts = {}): Promise<T> {
  const { revalidate = 300, tags, headers = {}, base } = opts;

  const isServer = typeof window === "undefined";
  const chosenBase =
    base === "public" ? PUBLIC :
    base === "internal" ? INTERNAL :
    isServer ? INTERNAL : PUBLIC;

  const url =
    /^https?:\/\//.test(path)
      ? path
      : (() => {
          if (!chosenBase) {
            throw new Error("Strapi base URL is not set. Set NEXT_PUBLIC_STRAPI_URL (and STRAPI_INTERNAL_URL for server).");
          }
          return `${chosenBase}${path.startsWith("/") ? "" : "/"}${path}`;
        })();

  if (!IS_PROD) console.log("[Strapi]", url);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      ...headers,
    },
    // ✅ Key: ISR settings
    next: { revalidate, ...(tags?.length ? { tags } : {}) },
  });

  if (!res.ok) throw new Error(`Strapi ${res.status} – ${url}`);
  const json = await res.json();
  // Most endpoints are returning { data: ... }
  return (json?.data ?? json) as T;
}

export function mediaURL(path?: string | null): string {
  if (!path) return "";
  return path.startsWith("http") ? path : `${PUBLIC}${path}`;
}

/** Accept both Strapi media shapes: flat {url} and nested {data.attributes.url} */
export type MediaLike =
  | { url?: string }
  | { data?: { attributes?: { url?: string } } };

/** Safe resolver -> absolute URL string (or empty string if missing) */
export function resolveMediaUrl(m?: MediaLike): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (m as any)?.url ?? (m as any)?.data?.attributes?.url ?? "";
  return mediaURL(raw || "");
}

/* ------------------------------------------------------------------ */
/*  Site-wide Global                                                   */
/* ------------------------------------------------------------------ */
export interface NavChild {
  label: string;
  href: string;
  isExternal?: boolean | null;
}
export interface NavItem { 
  label: string; 
  href: string; 
  isExternal?: boolean | null
  children?: NavChild[];
  key?: string;
}
export interface Social  { platform: string; url: string }

export interface GlobalData {
  id: number;
  address: string;
  opening_hours: string;
  inquiry: string;
  phone: string;
  email: string;
  copyright: string;
  nav_items: NavItem[];
  socials: Social[];
  footer_logo: { url: string };
  handwritng_logo_h: { url: string };
}

// Cache relatively short (nav/contact might change during ops): 10 min
export async function getGlobal(locale: Locale) {
  const query = toQuery({
    locale,
    populate: {
      nav_items: "*",
      socials:   "*",
      footer_logo:       { fields: ["url"] },
      handwritng_logo_h: { fields: ["url"] },
    },
  });
  return strapiFetch<GlobalData>(`/api/global?${query}`, {
    revalidate: 600,
    tags: ["global", `global:${locale}`],
  });
}

/* ------------------------------------------------------------------ */
/*  Home Page (single-type)                                           */
/* ------------------------------------------------------------------ */

export type SectionTitleCmp = {
  __component: 'sections.section-title'
  title_ja: string
  title_en: string
}

export type TextWithImgCmp = {
  __component: 'sections.text-with-img'
  headline?: string
  intro: BlocksContent                     // RTE blocks
  image?: { url: string }
}

export type ButtonCmp = {
  __component: 'sections.button'
  title: string          // label
  url?: string           // optional href
}

type MediaField     = { data?: { attributes: { url: string } } }

export interface HomePageRaw {
  id: number
  About?: (SectionTitleCmp | TextWithImgCmp | ButtonCmp | any)[]
  News?:  SectionTitleCmp[]
  handwritng_logo_v?: MediaField
  avatar?:            MediaField
  home_video?:        MediaField
}

export async function getHomePage(locale: Locale): Promise<HomePageRaw | null> {
  const q = qs.stringify(
    {
      locale,
      populate: {
        About: { populate: "*" },
        News:  { populate: "*" },
        handwritng_logo_v: { fields: ["url"] },
        avatar:            { fields: ["url"] },
        home_video:        { fields: ["url"] },
      },
    },
    { encodeValuesOnly: true },
  );

  return strapiFetch<HomePageRaw>(`/api/home-page?${q}`, {
    revalidate: 300, // 5 min
    tags: ["home", `home:${locale}`],
  });
}

/* ----------  About Page types -------------------------------------- */
export interface HistoryItem {
  era?: string | null;
  brief?: string | null;
}
export interface HistorySection {
  section_name?: string | null;
  content?: HistoryItem[];
}
export interface AboutPageData {
  header?: {
    heading?: { title_ja?: string; title_en?: string } | null;
    bg_image?: { url: string } | null;
  };
  tab_bar?:  { label: string; href: string; order?: number | null }[];
  content?:  {
    headline?: string | null;
    intro?: unknown;
    image?: { url: string } | null;
  }[];
  page_title?: string | null;
  intro_text?: string | null;
  history_section?: HistorySection[];
}

// Content updates less frequently: 15 min
export async function getAboutPage(locale: Locale): Promise<AboutPageData> {
  const q = qs.stringify(
    {
      locale,
      fields: ["page_title", "intro_text"],
      populate: {
        header:  { populate: ["bg_image", "heading"] },
        tab_bar: true,
        content: { populate: ["image"] },
        history_section: { populate: { content: true } },
      },
    },
    { encodeValuesOnly: true },
  );

  return strapiFetch<AboutPageData>(`/api/about-page?${q}`, {
    revalidate: 900,
    tags: ["about", `about:${locale}`],
  });
}

/* ------------------------------------------------------------------ */
/*  Highlights Page (single type)                                     */
/* ------------------------------------------------------------------ */
export interface HighlightsPageData {
  header?: {
    heading?: { title_ja?: string; title_en?: string } | null;
    bg_image?: { url: string } | null;
  };
  video_info?: {
      title?: string
      description?: string
      videoUrl?: string
      posterUrl?: { url: string }
    }[] 
  tab_bar?:  { label: string; href: string; order?: number | null }[];
}

// Similar editorial cadence: 15 min
export async function getHighlightsPage(locale: Locale): Promise<HighlightsPageData> {
  const q = qs.stringify(
    {
      locale,
      populate: {
        header: { populate: ["bg_image", "heading"] },
        tab_bar: true,
        video_info: { populate: ["posterUrl"] },
      },
    },
    { encodeValuesOnly: true }
  );
  return strapiFetch<HighlightsPageData>(`/api/highlights-page?${q}`, {
    revalidate: 900,
    tags: ["highlights", `highlights:${locale}`],
  });
}

/* ------------------------------------------------------------------ */
/*  People Catalogue API                                              */
/* ------------------------------------------------------------------ */
export interface PersonBrief {
  id: number;
  attributes: {
    name: string;
    slug: string;
    brief?: string; 
    order?: number | null;
    portrait?: { data?: { attributes: { url: string } } };
  };
}
export interface Category {
  id: number;
  attributes: {
    title: string;
    slug: string;
    people?: { data: PersonBrief[] };
    order?: number | null; 
  };
}
export interface PersonDetail {
  id: number;
  attributes: {
    name: string;
    slug: string;
    era?: string;
    biography?: any;
    order?: number | null; 
    brief?: string;
    portrait?: { data?: { attributes: { url: string } } };
    categories?: { data: { id: number; attributes: { title: string; slug: string } }[] };
    related_people?: { data: PersonBrief[] };
  };
}

// Category list (rarely changes): 30 min
export async function getCategoriesWithPeople(locale: Locale) {
  const query = toQuery({
    locale,
    populate: {
      people: {
        fields: ["name", "slug", "brief", "biography", "order"],
        populate: { portrait: { fields: ["url"] } },
      },
    },
  });
  return strapiFetch<Category[]>(`/api/categories?${query}`, {
    revalidate: 1800,
    tags: ["categories", `categories:${locale}`],
  });
}

// Person detail (infrequent edits): 30 min
export async function getPersonBySlug(slug: string, locale: Locale) {
  const query = toQuery({
    locale,
    filters: { slug },
    populate: {
      portrait:   { fields: ["url"] },
      categories: { fields: ["title", "slug", "order"] },
      related_people: {
        fields: ["name", "slug", "brief"],
        populate: { portrait: { fields: ["url"] } },
      },
    },
    pagination: { pageSize: 1 },
  });
  const list = await strapiFetch<PersonDetail[]>(`/api/people?${query}`, {
    revalidate: 1800,
    tags: ["person", `person:${slug}:${locale}`],
  });
  if (!list.length) throw new Error(`Person “${slug}” not found`);
  return list[0];
}

// People by category (occasionally changes): 20 min
export async function getPeopleByCategorySlug(catSlug: string, locale: Locale) {
  const query = toQuery({
    locale,
    filters: { categories: { slug: { $eq: catSlug } } },
    populate: { portrait: { fields: ["url"] } },
    fields:   ["name", "slug", "brief"],
    sort: ["name:asc"],
  });
  return strapiFetch<PersonBrief[]>(`/api/people?${query}`, {
    revalidate: 1200,
    tags: ["peopleByCategory", `peopleByCategory:${catSlug}:${locale}`],
  });
}

/* ------------------------------------------------------------------ */
/*  Pureland-Path Page                                                */
/* ------------------------------------------------------------------ */
export interface PathContent {
  id: number;
  headline?: string | null;
  intro: unknown;               // RTE blocks / HTML
  image?: { url: string };
}
export interface PathSection {
  id: number;
  headline?: string | null;
  content: PathContent[];
}
export interface PurelandPathPage {
  section_block: PathSection[];
}

export async function getPurelandPathPage(locale: Locale): Promise<PurelandPathPage> {
  const q = toQuery({
    locale,
    populate: {
      section_block: { populate: { content: { populate: ["image"] } } },
    },
  });

  const raw = await strapiFetch<any>(`/api/pureland-path-page?${q}`, {
    revalidate: 1800,
    tags: ["purelandPath", `purelandPath:${locale}`],
  });

  const attrs = "attributes" in raw ? raw.attributes : raw;

  const section_block: PathSection[] = (attrs.section_block ?? []).map(
    (s: any): PathSection => {
      const rawContent = s.content;
      const items = Array.isArray(rawContent) ? rawContent : rawContent?.data ?? [];
      return {
        id: s.id,
        headline: s.headline ?? null,
        content: items.map(
          (c: any): PathContent => ({
            id: c.id,
            headline: c.headline ?? null,
            intro: c.intro,
            image: c.image ? { url: c.image.url } : undefined,
          }),
        ),
      };
    },
  );

  return { section_block };
}

/* ------------------------------------------------------------------ */
/*  Wonders Page                                                      */
/* ------------------------------------------------------------------ */
export interface WonderContent {
  id: number;
  headline?: string | null;
  intro: unknown;
  image?: { url: string } | undefined;
}
export interface WondersPageData {
  page_headline?: string | null;
  intro?: string | null;
  content_block: WonderContent[];
}

export async function getWondersPage(locale: Locale): Promise<WondersPageData> {
  const q = toQuery({
    locale,
    fields: ["page_headline", "intro"],
    populate: { content_block: { populate: ["image"] } },
  });

  const raw = await strapiFetch<any>(`/api/wonders-page?${q}`, {
    revalidate: 1800,
    tags: ["wonders", `wonders:${locale}`],
  });

  const attrs = "attributes" in raw ? raw.attributes : raw;

  const getImageUrl = (img: any): string | undefined =>
    img?.url ?? img?.data?.attributes?.url ?? undefined;

  const content_block: WonderContent[] = (attrs.content_block ?? []).map(
    (item: any): WonderContent => ({
      id: item.id,
      headline: item.headline ?? null,
      intro: item.intro,
      image: getImageUrl(item.image) ? { url: getImageUrl(item.image)! } : undefined,
    })
  );

  return {
    page_headline: attrs.page_headline ?? null,
    intro: attrs.intro ?? null,
    content_block,
  };
}

/* ------------------------------------------------------------------ */
/*  News                                                              */
/* ------------------------------------------------------------------ */
export interface NewsBrief {
  slug: string;
  title: string;
  date: string;
}

// List changes often while publishing: 5 min
export async function getNewsList(locale: Locale): Promise<NewsBrief[]> {
  const q = toQuery({
    locale,
    fields: ["title", "slug", "date"],
    sort: ["date:desc"],
  });

  let list = await strapiFetch<any[]>(`/api/news-items?${q}`, {
    revalidate: 300,
    tags: ["news:list", `news:list:${locale}`],
  });

  if (!list?.length) {
    const qFallback = toQuery({
      fields: ["title", "slug", "date"],
      sort: ["date:desc"],
    });
    list = await strapiFetch<any[]>(`/api/news-items?${qFallback}`, {
      revalidate: 300,
      tags: ["news:list", "news:list:fallback"],
    });
  }

  return list.map((n) => ({
    slug : n.slug  ?? n.attributes?.slug,
    title: n.title ?? n.attributes?.title,
    date : n.date  ?? n.attributes?.date,
  }));
}

export interface NewsDetail {
  title: string;
  date : string;
  slug : string;
  body : any; // BlocksContent
}

const NEWS_IS_LOCALIZED = true; // kept for compatibility

// Detail: 30 min (update when editing or use tag revalidate)
export async function getNewsBySlug(slug: string, locale: Locale) {
  const qp = new URLSearchParams({
    "filters[$or][0][slug][$eq]": slug,
    "filters[$or][1][localizations][slug][$eq]": slug,
    "locale": locale,
    "populate": "*",
  });

  try {
    const rows = await strapiFetch<{ data: any[] } | any[]>(
      `/api/news-items?${qp.toString()}`,
      { revalidate: 1800, tags: ["news:detail", `news:${slug}:${locale}`] }
    );

    const list: any[] = Array.isArray(rows) ? rows : (rows.data ?? []);
    if (list.length > 0) {
      const row   = list[0];
      const attrs = row.attributes ?? row;
      return {
        title: attrs.title,
        date : attrs.date,
        slug : attrs.slug,
        body : attrs.body,
      };
    }

    // Fallback (no locale param)
    const qpFallback = new URLSearchParams({
      "filters[$or][0][slug][$eq]": slug,
      "filters[$or][1][localizations][slug][$eq]": slug,
      "populate": "*",
    });

    const fbRows = await strapiFetch<{ data: any[] } | any[]>(
      `/api/news-items?${qpFallback.toString()}`,
      { revalidate: 1800, tags: ["news:detail", `news:${slug}:fallback`] }
    );
    const fbList: any[] = Array.isArray(fbRows) ? fbRows : (fbRows.data ?? []);
    if (!fbList.length) return null;

    const fbRow   = fbList[0];
    const fbAttrs = fbRow.attributes ?? fbRow;

    return {
      title: fbAttrs.title,
      date : fbAttrs.date,
      slug : fbAttrs.slug,
      body : fbAttrs.body,
    };
  } catch (e: any) {
    console.error("[news:detail:error]", {
      slug, locale, status: e?.status, url: e?.url,
      bodyPreview: (e?.body || "").slice(0, 500),
      message: e?.message,
    });
    if (e?.status === 404) return null;
    throw e;
  }
}

/* ------------------------------------------------------------------ */
/*  Page Content by slug                                              */
/* ------------------------------------------------------------------ */

export async function getPageContentBySlug(slug: string, locale: string) {
  const query = qs.stringify(
    {
      filters: { slug: { $eq: slug } },
      locale,
      fields: ["title"],
      populate: {
        sections: { populate: { blocks: { populate: ["image"] } } },
      },
    },
    { encodeValuesOnly: true }
  );

  const path = `/api/page-contents?${query}`;
  if (!IS_PROD) console.log("[Strapi][getPageContentBySlug]", decodeURI(`${INTERNAL}${path}`));

  const raw = await strapiFetch<any>(path, {
    revalidate: 600,
    tags: ["pageContent", `pageContent:${slug}:${locale}`],
  });

  return raw?.[0] ?? raw?.data?.[0] ?? null;
}

/* ------------------------------------------------------------------ */
/*  Highlights shell (memoized)                                       */
/* ------------------------------------------------------------------ */
export const getHighlightsShell = cache(async (locale: Locale) => {
  const page = await getHighlightsPage(locale);

  const vi = page.video_info?.[0] ?? null;

  return {
    heroSrc:  mediaURL(page.header?.bg_image?.url),
    jaTitle:  page.header?.heading?.title_ja ?? "",
    enTitle:  page.header?.heading?.title_en ?? "",
    tabs:    (page.tab_bar ?? [])
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((t) => ({
        label: t.label,
        href:  t.href.startsWith("/")
          ? `/${locale}${t.href}`.replace("//", "/")
          : t.href,
      })),
    video: vi
      ? {
          title:       vi.title        ?? "",
          description: vi.description  ?? "",
          videoUrl:    vi.videoUrl     ?? "",
          posterUrl:   mediaURL(vi.posterUrl?.url),
        }
      : null,
  };
});

/* ------------------------------------------------------------------ */
/*  Events                                                            */
/* ------------------------------------------------------------------ */
export interface StrapiEvent {
  id: number;
  title: string;
  slug: string;
  date_start: string;
  date_end: string | null;
  event_kind: string;
  participation_tag: string;
  location?: string | null;
  month?: string;
  description?: any;
  time?: string | null;
}

// Full list (changes monthly/weekly): 5 min
export async function getAllEvents(locale: string): Promise<StrapiEvent[]> {
  const query = qs.stringify(
    {
      locale,
      sort: ["date_start:asc"],
      pagination: { pageSize: 200 },
    },
    { encodeValuesOnly: true },
  );
  return strapiFetch<StrapiEvent[]>(`/api/events?${query}`, {
    revalidate: 300,
    tags: ["events:all", `events:all:${locale}`],
  });
}

// Single event: 10 min
export async function getEventById(
  id: string,
  locale: string,
): Promise<StrapiEvent | null> {
  const query = qs.stringify(
    {
      filters: { id: { $eq: id } },
      locale,
      pagination: { pageSize: 1 },
    },
    { encodeValuesOnly: true },
  );

  const arr = await strapiFetch<StrapiEvent[]>(`/api/events?${query}`, {
    revalidate: 600,
    tags: ["event", `event:${id}:${locale}`],
  });
  return arr[0] ?? null;
}

