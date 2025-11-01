/** @format */
// app/contact/page.tsx

import { shippori } from '@/styles/fonts/fonts';
import HeroHeader from '@/components/ui/HeroHeader';
import ContactPageClient from '@/components/ContactPageClient';
import { getDictionary, isLocale, type Locale } from '@/i18n/get-dictionary';


// Added by fix-async-props codemod
type PageProps = {
  params: Promise<{ slug: string; locale: 'ja' | 'en' }>; // adjust keys as needed
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}


// Helper to convert readonly/undefined -> mutable string[]
const toMutable = (arr?: readonly string[]) => Array.from(arr ?? []);

export default async function ContactPage(props: PageProps) {
  // Next 15 async request props shim (added by codemod)
  const params = await props.params;
  const searchParams = props.searchParams ? await props.searchParams : undefined;

  const locale = params.locale    
  // If this route is static (app/contact), no params exist -> default to 'ja'

  const dict = await getDictionary(locale);

  // Build mutable, non-undefined arrays for the client
  const options = {
    cats:        toMutable(dict.options?.cats),
    desired:     toMutable(dict.options?.desired),
    age:         toMutable(dict.options?.age),
    gender:      toMutable(dict.options?.gender),
    enquete_cat: toMutable(dict.options?.enquete_cat),
    reason:      toMutable(dict.options?.reason),
    evaluation1: toMutable(dict.options?.evaluation1),
    evaluation2: toMutable(dict.options?.evaluation2),
  };

  return (
    <main className={`min-h-screen text-[#1f1f1f] ${shippori.className}`}>
      <HeroHeader bgSrc="/imgs/sub-pages/comeback.jpg" title="お問い合わせ" subtitle="contact" />
      <ContactPageClient dict={dict} options={options} lang={locale} />
    </main>
  );
}
