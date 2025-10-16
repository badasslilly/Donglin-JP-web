// next-intl.config.ts
import type { NextIntlConfig } from 'next-intl';

const config: NextIntlConfig = {
  locales: ['ja', 'en'],
  defaultLocale: 'ja'
  // No messages here; you load them at runtime elsewhere
};

export default config;

