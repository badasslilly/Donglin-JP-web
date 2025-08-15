// i18n/get-dictionary.ts
import ja from './dictionaries/ja';
import en from './dictionaries/en';

export const locales = ['ja', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ja';
export const isLocale = (x: string): x is Locale =>
  (locales as readonly string[]).includes(x);

// ✅ arrays are readonly here so `as const` dicts satisfy it
export type DictSchema = {
  stepper: { enter: string; review: string; done: string };
  hero: { title: string; subtitle: string };
  blurb: readonly string[];
  labels: {
    cat: string; desired: string; name: string; email: string; tel: string; comment: string;
    age: string; gender: string; enquete_cat: string; reason: string;
    evaluation1: string; evaluation2: string; enquete_cmt: string;
    required: string; reviewNote: string; toReview: string; back: string; submit: string;
    sentTitle: string; sentBody: string;
  };
  options?: {
    cats: readonly string[];
    desired: readonly string[];
    age: readonly string[];
    gender: readonly string[];
    enquete_cat: readonly string[];
    reason: readonly string[];
    evaluation1: readonly string[];
    evaluation2: readonly string[];
  };
};

export type ContactDict = DictSchema;

export async function getDictionary(locale: Locale): Promise<ContactDict> {
  return locale === 'en' ? en : ja;
}
