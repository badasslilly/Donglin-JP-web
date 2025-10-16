// nextjs/src/i18n/request.ts
import {getRequestConfig} from 'next-intl/server';

const locales = ['ja', 'en'] as const;
type AppLocale = (typeof locales)[number];
const defaultLocale: AppLocale = 'ja';

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale: AppLocale = (locales as readonly string[]).includes(requested as string)
    ? (requested as AppLocale)
    : defaultLocale;

  return {
    locale,
    // IMPORTANT: keep this relative path (no "@/")
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
