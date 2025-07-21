import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';   // ✅ built-in helper

export default async function RootRedirect() {
  /* Locale was detected in middleware; this just reads it */
  const locale = await getLocale();             // 'ja' | 'en' | …
  redirect(`/${locale}`);
}
