/** @format */

import Image from 'next/image'

import { getCategoriesWithPeople, mediaURL, Locale } from '@/lib/strapi'
import CategorySection from '@/components/ui/CategorySection'

interface PersonRaw {
  id: number
  name: string
  order?: number | null
  brief?: string
  portrait?: { url?: string; data?: { attributes: { url: string } } }
}

interface PersonFlat {
  id: number
  name: string
  order?: number | null
  brief?: string
  src: string
}

interface CategoryFlat {
  id: number
  title: string
  slug: string
  order?: number | null
  people?: any
}

/* put this near the top of people/page.tsx -------------------------------- */
const byOrderAsc = <
  T extends { order?: string | number | null; title?: string | null }
>(
  a: T,
  b: T,
  locale = "ja",
) => {
  const A = a.order === null || a.order === undefined ? Infinity : +a.order;
  const B = b.order === null || b.order === undefined ? Infinity : +b.order;

  if (A !== B) return A - B;

  /* title may be undefined → fallback to "" to avoid TypeError */
  const titleA = a.title ?? "";
  const titleB = b.title ?? "";

  return titleA.localeCompare(titleB, locale);
};



// helper – flatten Strapi v5 wrapper when present
const unwrap = <T extends Record<string, any>>(x: any): T =>
  ('attributes' in x ? { id: x.id, ...x.attributes } : x) as T

interface PageProps {
  searchParams?: { locale?: Locale; category?: string }
}

export default async function PeopleIndex({
    searchParams: promiseSP,
  }: {
    searchParams: Promise<{ locale?: Locale; category?: string }>;
  }) {
    const { locale = "ja" } = await promiseSP;

  /* ── all categories view ───────────────────────────────────── */
  const cats: CategoryFlat[] = (await getCategoriesWithPeople(locale))
  .map((x): CategoryFlat => unwrap<CategoryFlat>(x))
  .sort((a, b) => byOrderAsc(a, b, locale));
    
  return (
    <main className='max-w-6xl mx-auto px-2 py-5'>
      {/* ---------- title with seal icon ---------- */}
      <div className='mb-10 flex items-center justify-center gap-2'>
        <Image
          src='/imgs/buddha_seal.png'
          alt=''
          width={88}
          height={88}
          className='w-26 h-26 object-contain'
          priority
        />
        <h1 className='text-4xl font-bold'>東林人物図鑑</h1>
      </div>

      {cats.map((cat) => {
        const people: PersonFlat[] = (cat.people?.data ?? cat.people ?? [])
          .map((x: unknown): PersonRaw => unwrap<PersonRaw>(x)) // x typed
          .sort(byOrderAsc)
          .map(
            (p: PersonRaw): PersonFlat => ({
              id: p.id,
              name: p.name,
              brief: p.brief,
              order: p.order,
              src: mediaURL(
                p.portrait?.url ?? p.portrait?.data?.attributes?.url ?? ''
              ),
            })
          )

        if (!people.length) return null

        return (
          // <section key={cat.id} className='mb-20'>
          //   <div className='mb-4 flex justify-between items-center pb-5'>
          //     <BannerTitle
          //       title={cat.title}
          //       href={`/people?category=${cat.slug}`}
          //     />
          //   </div>

          //   <div className='grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4'>
          //     {people.map((p: PersonFlat) => (
          //       <PersonCard
          //         key={p.id}
          //         name={p.name}
          //         portrait={p.portrait}
          //         biography={p.brief}
          //       />
          //     ))}
          //   </div>
          // </section>
          <CategorySection
            key={cat.id}
            title={cat.title}
            slug={cat.slug}
            people={people}
          />
        )
      })}
    </main>
  )
}
