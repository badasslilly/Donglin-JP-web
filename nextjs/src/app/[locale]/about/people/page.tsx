/** @format */

import Image from 'next/image'
import { getCategoriesWithPeople, mediaURL, Locale } from '@/lib/strapi'
import CategorySection, { PersonFlat } from '@/components/ui/CategorySection'
import type { WithAsyncRequest } from '@/utils/next-async-props'

interface PersonRaw {
  id: number
  slug: string
  name: string
  order?: number | null
  brief?: string
  portrait?: { url?: string; data?: { attributes: { url: string } } }
}

interface CategoryFlat {
  id: number
  title: string
  slug: string
  order?: number | null
  people?: any
}

const byOrderAsc = <
  T extends { order?: string | number | null; title?: string | null },
>(
  a: T,
  b: T,
  locale = 'ja'
) => {
  const A = a.order === null || a.order === undefined ? Infinity : +a.order
  const B = b.order === null || b.order === undefined ? Infinity : +b.order
  if (A !== B) return A - B
  return (a.title ?? '').localeCompare(b.title ?? '', locale)
}

const unwrap = <T extends Record<string, any>>(x: any): T =>
  ('attributes' in x ? { id: x.id, ...x.attributes } : x) as T

type PagePropsSync = {
  params: { locale: Locale }
  // add searchParams if you use it, otherwise omit it
}
type PageProps = WithAsyncRequest<PagePropsSync>

export default async function PeopleIndex(props: PageProps) {
  const { locale } = await props.params

  const cats: CategoryFlat[] = (await getCategoriesWithPeople(locale))
    .map((x): CategoryFlat => unwrap<CategoryFlat>(x))
    .sort((a, b) => byOrderAsc(a, b, locale))

  return (
    <main className='max-w-6xl mx-auto px-2 py-5'>
      <div className='mb-10 flex items-center justify-center gap-3 sm:gap-4'>
        <Image
          src='/imgs/buddha_seal.png'
          alt='東林寺ロゴ'
          width={88}
          height={88}
          className='h-16 w-16 sm:h-20 sm:w-20 object-contain'
          priority
        />
        <h1 className='text-2xl font-bold sm:text-3xl md:text-4xl'>
          東林人物図鑑
        </h1>
      </div>

      {cats.map((cat) => {
        const people: PersonFlat[] = (cat.people?.data ?? cat.people ?? [])
          .map((x: unknown): PersonRaw => unwrap<PersonRaw>(x))
          .sort(byOrderAsc)
          .map(
            (p: PersonRaw): PersonFlat => ({
              id: p.id,
              slug: p.slug,
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
          <CategorySection
            key={cat.id}
            title={cat.title}
            slug={cat.slug}
            people={people}
            locale={locale}
          />
        )
      })}
    </main>
  )
}
