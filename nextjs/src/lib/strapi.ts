import { BlocksContent } from "@strapi/blocks-react-renderer";
import { notFound } from "next/navigation";
import qs from "qs";
import { cache } from "react";

/* ------------------------------------------------------------------ */
/*  ENV – set these in .env                                           */
/* ------------------------------------------------------------------ */
const PUBLIC   = process.env.NEXT_PUBLIC_STRAPI_URL!;
const INTERNAL = process.env.STRAPI_INTERNAL_URL;         // e.g. http://127.0.0.1:1337
const TOKEN = process.env.STRAPI_TOKEN!;      // read-only API token
const isServer = typeof window === 'undefined';

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */
export type Locale = "ja" | "en";

function toQuery(obj: object) {
  return qs.stringify(obj, { 
    encodeValuesOnly: true, 
    arrayFormat: "repeat" });
}

/* helper ----------------------------------------------------------- */
export async function strapiFetch<T = unknown>(path: string): Promise<T> {
  const url =
    /^https?:\/\//.test(path)
      ? path
      : `${isServer ? INTERNAL : PUBLIC}${path.startsWith('/') ? '' : '/'}${path}`;

  // Debug log
  console.log('[Strapi]', url);

  // 🐞 DEBUG: log the final request URL in the server console
  console.log("[Strapi]", url);

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    next:    { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`Strapi ${res.status} – ${url}`);
  return (await res.json()).data as T;
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
/*  Site-wide Global (unchanged)                                      */
/* ------------------------------------------------------------------ */
export interface NavItem { label: string; href: string; isExternal?: boolean | null }
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

export async function getGlobal(locale: Locale) {
  const query = toQuery({
    locale,
    populate: {
      nav_items: "*",
      socials:   "*",
      footer_logo:      { fields: ["url"] },
      handwritng_logo_h:{ fields: ["url"] },
    },
  });
  return strapiFetch<GlobalData>(`/api/global?${query}`);
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
  // … plus timestamps etc.  (we just ignore them)
}

export async function getHomePage(locale: Locale): Promise<HomePageRaw | null> {
  const q = qs.stringify(
    {
      locale,                        // 'ja' | 'en'
      populate: {
        About: { populate: '*' },    // every component inside
        News:  { populate: '*' },
        handwritng_logo_v: { fields: ['url'] },
        avatar:            { fields: ['url'] },
        home_video:        { fields: ['url'] },
      },
    },
    { encodeValuesOnly: true },
  )

  return await strapiFetch<HomePageRaw>(`/api/home-page?${q}`)
}

/* ----------  About Page types -------------------------------------- */
export interface HistoryItem {
  era?: string | null;
  brief?: string | null;
}

export interface HistorySection {
  section_name?: string | null;
  content?: HistoryItem[];          // repeatable component “History Item”
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

  // ⬇️ replaced fields
  history_section?: HistorySection[];   // repeatable “History Section”
}

/* ------------ selective populate ----------------------------------- */
export async function getAboutPage(locale: Locale): Promise<AboutPageData> {
  const q = qs.stringify(
    {
      locale,
      fields: ['page_title', 'intro_text'],  // removed 'history_headline'
      populate: {
        header:  { populate: ['bg_image', 'heading'] },
        tab_bar: true,
        content: { populate: ['image'] },

        // NEW: nested component -> nested populate
        history_section: {
          populate: { content: true }, // brings [ { era, brief } ... ]
        },
      },
    },
    { encodeValuesOnly: true },
  );

  return await strapiFetch<AboutPageData>(`/api/about-page?${q}`);
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

export async function getHighlightsPage(
  locale: Locale
): Promise<HighlightsPageData> {
  const q = qs.stringify(
    {
      locale,
      populate: {
        header: { populate: ['bg_image', 'heading'] },
        tab_bar: true,
        video_info: { populate: ['posterUrl'] },   // or videoInfo
      },
    },
    { encodeValuesOnly: true }
  )
  return strapiFetch<HighlightsPageData>(`/api/highlights-page?${q}`);
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
    brief?: string;                                   // ★ NEW
    portrait?: { data?: { attributes: { url: string } } };
    categories?: { data: { id: number; attributes: { title: string; slug: string } }[] };
    related_people?: { data: PersonBrief[] };
  };
}

/* ------ list page: categories + people (with brief + portrait) ---- */
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
  return strapiFetch<Category[]>(`/api/categories?${query}`);
}

/* ------ detail page: unchanged except brief now returned ---------- */
export async function getPersonBySlug(slug: string, locale: Locale) {
  const query = toQuery({
    locale,
    filters: { slug },
    populate: {
      portrait:   { fields: ["url"] },
      categories: { fields: ["title", "slug", "order"] },
      related_people: {
        fields: ["name", "slug", "brief"],            // ★ brief added
        populate: { portrait: { fields: ["url"] } },
      },
    },
    pagination: { pageSize: 1 },
  });
  const list = await strapiFetch<PersonDetail[]>(`/api/people?${query}`);
  if (!list.length) throw new Error(`Person “${slug}” not found`);
  return list[0];
}

/* ------ people filtered by category slug -------------------------- */
export async function getPeopleByCategorySlug(catSlug: string, locale: Locale) {
  const query = toQuery({
    locale,
    filters: { categories: { slug: { $eq: catSlug } } },
    populate: { portrait: { fields: ["url"] } },
    fields:   ["name", "slug", "brief"],              // ★ brief added
    sort: ["name:asc", ],
  });
  return strapiFetch<PersonBrief[]>(`/api/people?${query}`);
}

/* ------------------------------------------------------------------ */
/*  Pureland-Path Page (浄土宗修学概述)                                */
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
  content: PathContent[];       // ← already flattened
}

export interface PurelandPathPage {
  section_block: PathSection[];
}
/* ------------------------------------------------------------------ */
/*  Pureland-Path Page (浄土宗修学概述)                                */
/* ------------------------------------------------------------------ */

export async function getPurelandPathPage(
  locale: Locale,
): Promise<PurelandPathPage> {
  const q = toQuery({
    locale,
    populate: {
      section_block: {
        populate: { content: { populate: ["image"] } },
      },
    },
  });

  /* strapiFetch already returns the `.data` field */
  const raw = await strapiFetch<any>(`/api/pureland-path-page?${q}`);

  /* single-type → { id, attributes:{ … } } */
  const attrs = "attributes" in raw ? raw.attributes : raw;

  const section_block: PathSection[] = (attrs.section_block ?? []).map(
    (s: any): PathSection => {
      /* 🔑 handle both shapes:  [ … ] or { data:[ … ] }  */
      const rawContent = s.content;
      const items = Array.isArray(rawContent)
        ? rawContent
        : rawContent?.data ?? [];

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
/*  Wonders Page (浄土宗修学概述)                                */
/* ------------------------------------------------------------------ */
export interface WonderContent {
  id: number;
  headline?: string | null;
  intro: unknown;                     // RTE / Blocks
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
    fields:   ["page_headline", "intro"],  
    populate: {
      // populate the media field on the repeatable component
      content_block: { populate: ['image'] },
    },
  });

  // strapiFetch returns `.data`; single-type => { id, attributes }
  const raw = await strapiFetch<any>(`/api/wonders-page?${q}`);
  const attrs = 'attributes' in raw ? raw.attributes : raw;

  const getImageUrl = (img: any): string | undefined =>
    img?.url ??
    img?.data?.attributes?.url ??
    undefined;

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
    content_block };
}


/* ---------- News list ------------------------------ */
export interface NewsBrief {
  slug: string;
  title: string;
  date: string;
}

export async function getNewsList(locale: Locale): Promise<NewsBrief[]> {
  const q = toQuery({
    locale,
    fields: ['title', 'slug', 'date'],
    sort:   ['date:desc'],
    // remove pageSize if you want **all** items,
    //   otherwise keep or change the number
  });

  // 1️⃣  strapiFetch already gives you the array in .data,
  //     so receive it directly
  const list = await strapiFetch<any[]>(`/api/news-items?${q}`);

  // 2️⃣  flatten whether Strapi sends attributes or not
  return list.map((n) => ({
    slug : n.slug  ?? n.attributes?.slug,
    title: n.title ?? n.attributes?.title,
    date : n.date  ?? n.attributes?.date,
  }));
}


/* ---------- News detail ---------------------------------------- */
export interface NewsDetail {
  title: string;
  date : string;
  slug : string;
  body : any;            // BlocksContent（型を合わせて下さい）
}

const NEWS_IS_LOCALIZED = false;
export async function getNewsBySlug(slug: string, locale: Locale) {
  const qp = new URLSearchParams({
    'filters[slug][$eq]': slug,
    'populate': '*',
  });
  if (NEWS_IS_LOCALIZED) qp.set('locale', locale);

  console.log('[news:detail:req]', { slug, locale, NEWS_IS_LOCALIZED, qs: qp.toString() });

  try {
    const rows = await strapiFetch<{ data: any[] } | any[]>(
      `/api/news-items?${qp.toString()}`
    );

    const list: any[] = Array.isArray(rows) ? rows : (rows.data ?? []);
    if (!list.length) return null;

    const row   = list[0];
    const attrs = row.attributes ?? row;

    return {
      title: attrs.title,
      date : attrs.date,
      slug : attrs.slug,
      body : attrs.body,
    };
  } catch (e: any) {
    console.error('[news:detail:error]', {
      slug, locale, status: e?.status, url: e?.url,
      bodyPreview: (e?.body || '').slice(0, 500),
      message: e?.message,
    });
    if (e?.status === 404) return notFound();
    throw e;
  }
}


export async function getPageContentBySlug(slug: string, locale: string) {
  const query = qs.stringify(
    {
      filters: { slug: { $eq: slug } },
      locale,
      populate: {
        sections: {
          populate: {
            blocks: { populate: ['image'] },
          },
        },
      },
    },
    { encodeValuesOnly: true }
  )

  const res = await fetch(`${PUBLIC}/api/page-contents?${query}`, {
    next: { revalidate: 60 },
  })
  if (!res.ok) throw new Error('Strapi fetch failed')

  const json = await res.json()
  // v5 returns flattened objects (no .attributes)
  return json.data?.[0] ?? null
}

/* ------------------------------------------ */
/*  lib/strapi.ts (or wherever the helper is) */
/* ------------------------------------------ */


export const getHighlightsShell = cache(async (locale: Locale) => {
  const page = await getHighlightsPage(locale)

  /*  safest way → works whether it’s [] or undefined  */
  const vi = page.video_info?.[0] ?? null     // ← grab first component

  return {
    /* hero + tabs … (unchanged) */
    heroSrc:  mediaURL(page.header?.bg_image?.url),
    jaTitle:  page.header?.heading?.title_ja ?? '',
    enTitle:  page.header?.heading?.title_en ?? '',
    tabs:    (page.tab_bar ?? [])
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((t) => ({
        label: t.label,
        href:  t.href.startsWith('/')
          ? `/${locale}${t.href}`.replace('//', '/')
          : t.href,
      })),

    /* video block */
    video: vi
      ? {
          title:       vi.title        ?? '',
          description: vi.description  ?? '',
          videoUrl:    vi.videoUrl     ?? '',
          posterUrl:   mediaURL(vi.posterUrl?.url),
        }
      : null,
  }
})


export interface StrapiEvent {
  id: number
  title: string
  slug: string
  date_start: string
  date_end: string | null
  event_kind: string
  participation_tag: string
  location?: string | null
  month?: string
  description?: any
  time?: string | null   
}

/* ----- すべてのイベントを取得 (公開済) ----- */
export async function getAllEvents(locale: string): Promise<StrapiEvent[]> {
  const query = qs.stringify(
    {
      locale,
      sort: ['date_start:asc'],
      pagination: { pageSize: 200 },
    },
    { encodeValuesOnly: true },
  )

  /* strapiFetch<T>() は .data 部分を返してくれる想定 */
  return await strapiFetch<StrapiEvent[]>(`/api/events?${query}`)
}

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
  )

  // ✅ 正しい型を指定
  const arr = await strapiFetch<StrapiEvent[]>(`/api/events?${query}`)
  return arr[0] ?? null
}
