/** @format */

'use client'

import { useState, useCallback } from 'react'

import type { BlocksContent } from '@strapi/blocks-react-renderer'
import SectionHeading from './SectionHeading'
import PersonCard from './PersonCard'
import PersonModal from './PersonModal'
import qs from 'qs'
import { Locale } from '@/lib/strapi'

export interface PersonFlat {
  id: number
  slug: string
  name: string
  brief?: string
  order?: number | null
  src: string // full image URL (already resolved server-side)
}

export interface PersonFull {
  id: number
  name: string
  portrait?: string // may be absent
  body: BlocksContent // Strapi “Blocks”
  src: string
}

interface Props {
  title: string
  slug: string
  people: PersonFlat[]
  locale: Locale
}

export default function CategorySection({ title, slug, people, locale }: Props) {
  const [isGridOpen, setGridOpen] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [person, setPerson] = useState<PersonFull | null>(null)

  /* ------------------------------------------------------------ */
  // npm i qs

  const handleSelect = useCallback(
      async (slug: string) => {
    if (!slug) return
    setLoading(true)

    try {
      /* ----------------- クエリ文字列を生で作る ----------------- */
      const query = qs.stringify(
        {
          locale,  
          filters: { slug: { $eq: slug } },
          pagination: { limit: 1 },
        },
        { encode: false } // ★ ココがミソ
      )

      const base = (process.env.NEXT_PUBLIC_STRAPI_URL ?? '').replace(/\/$/, '')
      if (!base) throw new Error('NEXT_PUBLIC_STRAPI_URL is not defined')

      const url = `${base}/api/people?${query}`
      console.log('fetch:', url) // => /api/people?filters[slug][$eq]=huiyuan&pagination[limit]=1

      const res = await fetch(url)
      if (!res.ok) throw new Error(`Strapi ${res.status} – ${url}`)

      const json = await res.json()
      const record = Array.isArray(json.data) ? json.data[0] : json.data

      setPerson({
        id: record.id,
        name: record.name,
        portrait: record.portrait?.data?.attributes?.url,
        body: record.biography,
        src: record.src
        
      })
      setModalOpen(true)
    } catch (err) {
      console.error(err)
          alert(
              locale === 'ja'
                ? '人物詳細データの取得に失敗しました。'
                : 'Failed to load person details.',
            )
    } finally {
      setLoading(false)
    }
  }, [locale])

  /* ------------------------------------------------------------ */
  return (
    <section id={slug} className='mb-20'>
      {/* heading bar */}
      <div className='flex w-full items-center justify-between bg-[#f6f3e7]/90 px-6'>
        <SectionHeading title={title} />

        <button
          onClick={() => setGridOpen(!isGridOpen)}
          aria-label={isGridOpen ? '折りたたむ' : '展開'}
          className='relative flex h-6 w-6 items-center justify-center'
        >
          <span
            className={`absolute h-0.5 w-4 bg-[#004aad] transition-transform ${
              isGridOpen ? 'rotate-0' : '-rotate-90'
            }`}
          />
          <span className='absolute h-0.5 w-4 bg-[#004aad]' />
        </button>
      </div>

      {/* people grid */}
      {isGridOpen && (
        <div className='mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 items-stretch'>
          {people.map((p) => (
            <PersonCard 
              key={p.id}
              slug={p.slug}
              name={p.name}
              brief={p.brief}
              src={p.src}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}

      {/* lazy-loaded modal */}
      {person && (
        <PersonModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          person={person}
        />
      )}
    </section>
  )
}
