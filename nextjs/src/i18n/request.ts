// src/i18n/request.ts
import {getRequestConfig} from 'next-intl/server';

const ALLOWED = ['ja', 'en'] as const;
type L = typeof ALLOWED[number];

function normalize(l: string | undefined): L {
  // accept "/jp" and map to "ja"
  const cand = (l === 'jp' ? 'ja' : (l ?? '')).toLowerCase();
  return (ALLOWED as readonly string[]).includes(cand) ? (cand as L) : 'ja';
}

export default getRequestConfig(async ({locale}) => {
  const active = normalize(locale);
  const messages = (await import(`../messages/${active}.json`)).default;
  return {locale: active, messages};
});

