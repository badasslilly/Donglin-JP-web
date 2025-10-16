/** @format */
import { notFound } from 'next/navigation'
import dayjs from 'dayjs'
import 'dayjs/locale/ja'
import 'dayjs/locale/en'
import { shippori } from '@/styles/fonts'
import { kindColor, kindLabel, badgeColor, tagLabel } from '@/data/kinds'
import { getEventById } from '@/lib/strapi'
import BlockRendererClient from '@/components/BlockRendererClient'
import Link from 'next/link'
import type { WithAsyncRequest } from '@/utils/next-async-props'

// Added by fix-async-props codemod
type PagePropsSync = { params?: any; searchParams?: any };
type PageProps = WithAsyncRequest<PagePropsSync>


function formatDateWithWeekday(iso: string, locale: string) {
  const lang = locale.startsWith('ja') ? 'ja' : 'en'
  const d = dayjs(iso).locale(lang)
  return lang === 'ja'
    ? d.format('YYYY年M月D日(ddd)')
    : d.format('ddd, D MMM YYYY')
}

/* ───── Page Component (await params) ───── */
export default async function EventDetail(props: PageProps) {
  // 👇 must await params in Next 15
  const { id, locale } = await props.params

  const ev = await getEventById(id, locale)
  if (!ev) notFound()

  // date text
  const dateText =
    ev.date_end && ev.date_end !== ev.date_start
      ? `${formatDateWithWeekday(ev.date_start, locale)} 〜 ${formatDateWithWeekday(
          ev.date_end,
          locale,
        )}`
      : formatDateWithWeekday(ev.date_start, locale)

  return (
    <main className={`bg-white ${shippori.className}`}>
      <article className="mx-auto max-w-4xl space-y-12 px-6 py-16">
        {/* ───── Tags ───── */}
        <div className="mb-6 flex gap-4">
          <span
            className={`inline-block rounded px-3 py-1 text-sm font-medium ${kindColor(
              ev.event_kind,
            )}`}
          >
            {kindLabel(ev.event_kind, locale)}
          </span>
          <span
            className={`inline-block rounded border px-3 py-1 text-sm font-medium ${badgeColor(
              ev.participation_tag,
            )}`}
          >
            {tagLabel(ev.participation_tag.trim(), locale)}
          </span>
        </div>

        {/* ───── Title & rule ───── */}
        <h1 className="text-3xl font-semibold tracking-wide">{ev.title}</h1>
        <hr className="border-gray-300" />

        {/* ───── Basics ───── */}
        <section className="border border-gray-200">
          <div className="flex">
            <span className="my-5 ml-5 w-1 bg-gray-300/70" />
            <dl className="grid flex-1 grid-cols-[6rem_1fr] gap-y-4 px-3 py-4">
              <dt className="bg-gray-100 px-3 py-2 font-medium text-gray-600">
                {locale === 'ja' ? '開催日' : 'Date'}
              </dt>
              <dd className="pl-5 py-2 font-light ">{dateText}</dd>

              {ev.time && (
                <>
                  <dt className="bg-gray-100 px-3 py-2 font-medium text-gray-600">
                    {locale === 'ja' ? '時間' : 'Time'}
                  </dt>
                  <dd className="pl-5 py-2 font-light">{ev.time}</dd>
                </>
              )}

              {ev.location && (
                <>
                  <dt className="bg-gray-100 px-3 py-2 font-medium text-gray-600">
                    {locale === 'ja' ? '場所' : 'Place'}
                  </dt>
                  <dd className="pl-5 py-2 font-light">{ev.location}</dd>
                </>
              )}
            </dl>
          </div>
        </section>

        {/* ───── Body (Strapi Blocks) ───── */}
        {ev.description && <BlockRendererClient content={ev.description} />}

        {/* ───── Back link ───── */}
        <div className="flex w-full justify-center">
          <Link
            href={`/${locale}/events`}
            className="mb-10 inline-flex items-center gap-2 rounded-lg bg-gray-100 px-6 py-3 text-gray-700 shadow-sm transition-colors hover:bg-gray-200 hover:text-gray-900"
          >
            <span className="text-lg">←</span>
            {locale === 'ja' ? '行事一覧に戻る' : 'Back to all events'}
          </Link>
        </div>
      </article>
    </main>
  )
}
