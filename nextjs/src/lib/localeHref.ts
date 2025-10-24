/** @format */

// Prefix a site-relative path with the locale.
// - External URLs are returned unchanged.
// - Supports "jp" alias → "ja".
// - Avoids double-prefixing if the path already starts with /ja or /en.
export type AppLocale = 'ja' | 'en';

export function localeHref(href: string, locale: string): string {
  if (!href) return '/';
  if (/^https?:\/\//i.test(href)) return href; // external

  const loc = (locale === 'jp' ? 'ja' : locale) as AppLocale;

  // ensure leading slash
  let path = href.startsWith('/') ? href : `/${href}`;

  // if already prefixed with a supported locale, keep as-is
  if (path.startsWith('/ja/') || path.startsWith('/en/')) return path;

  // Prefix with locale and normalize double slashes
  return `/${loc}${path}`.replace(/\/{2,}/g, '/');
}

