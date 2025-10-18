// src/i18n/request.ts
import { getRequestConfig, type GetRequestConfigParams, type RequestConfig } from 'next-intl/server';

const locales = ['ja', 'en'] as const;
type AppLocale = (typeof locales)[number];
const defaultLocale: AppLocale = 'ja';

export default getRequestConfig(
  // explicitly annotate params and return type so TS can check properly
  async ({ requestLocale }: GetRequestConfigParams): Promise<RequestConfig> => {
    const requested = await requestLocale; // type: string | undefined

    const locale: AppLocale =
      typeof requested === 'string' && (locales as readonly string[]).includes(requested)
        ? (requested as AppLocale)
        : defaultLocale;

    const messages = (await import(`../messages/${locale}.json`)).default;

    return { locale, messages }; // locale is definitely `string` here
  },
);
