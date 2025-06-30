// import qs from 'qs';

// const API = process.env.NEXT_PUBLIC_STRAPI_URL;

// // Home
// function mustHaveData(json: any, name: string, locale: string) {
//   if (!json.data) throw new Error(`${name} (${locale}) is missing or unpublished`);
//   return json.data.attributes;
// }

// export async function fetchHome(locale: 'ja' | 'en') {
//   const query = qs.stringify(
//     { locale, populate: { hero_slides: { populate: ['image'] }, intro: { populate: ['crest','kanji_vertical'] }, promos: { populate: ['images'] } } },
//     { encodeValuesOnly: true },
//   );
//   const res  = await fetch(`${API}/api/home-page?${query}`, { cache: 'no-store' });
//   return mustHaveData(await res.json(), 'Home Page', locale);
// }

// export async function fetchGlobal(locale: 'ja' | 'en') {
//   const query = qs.stringify({ locale, populate: ['nav_items', 'socials'] });
//   const res  = await fetch(`${API}/api/global?${query}`, { cache: 'no-store' });
//   return mustHaveData(await res.json(), 'Global', locale);
// }