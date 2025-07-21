import qs from "qs";

/* ------------------------------------------------------------------ */
/*  ENV – set these in .env                                           */
/* ------------------------------------------------------------------ */
const API   = process.env.STRAPI_URL!;        // e.g. http://127.0.0.1:1337
const TOKEN = process.env.STRAPI_TOKEN!;      // read-only API token

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
async function strapiFetch<T = unknown>(path: string): Promise<T> {
  const url = `${API}${path}`;

  // 🐞 DEBUG: log the final request URL in the server console
  console.log("[Strapi]", url);

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
    next:    { revalidate: 60 },
  });

  if (!res.ok) throw new Error(`Strapi ${res.status} – ${url}`);
  return (await res.json()).data as T;
}


export function mediaURL(path?: string | null) {
  return !path ? "" : path.startsWith("http") ? path : `${API}${path}`;
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


/* ----------  About Page types -------------------------------------- */
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
}

/* ------------ selective populate -- */
export async function getAboutPage(locale: Locale): Promise<AboutPageData> {
  const q = qs.stringify({
    locale,
    populate: {
      header:  { populate: ['bg_image', 'heading'] },
      tab_bar: true,
      content: { populate: ['image'] }
    }
  });
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
  tab_bar?:  { label: string; href: string; order?: number | null }[];
}

export async function getHighlightsPage(
  locale: Locale
): Promise<HighlightsPageData> {
  const q = toQuery({
    locale,
    populate: {
      header:  { populate: ["bg_image", "heading"] },
      tab_bar: true,
    },
  });
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
    biography?: string;
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
        fields: ["name", "slug", "brief", "order"],          
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
