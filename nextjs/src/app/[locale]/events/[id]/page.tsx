/** @format */
import { notFound } from 'next/navigation'
import dayjs from 'dayjs'
import 'dayjs/locale/ja'
import 'dayjs/locale/en'
import { shippori } from '@/styles/fonts'
import { kindColor, kindLabel, badgeColor, tagLabel } from '@/data/kinds'
import { getEventById, strapiFetch } from '@/lib/strapi'

import BlockRendererClient from '@/components/BlockRendererClient'
import Link from 'next/link'

export function formatDateWithWeekday(
  iso: string,
  locale: string,
) {
  /* 1) "ja", "ja-JP" → ja  /  それ以外 → en */
  const lang = locale.startsWith('ja') ? 'ja' : 'en'

  /* 2) ローカライズ */
  const d = dayjs(iso).locale(lang)

  /* 3) 曜日書式 */
  return lang === 'ja'
    ? d.format('YYYY年M月D日(ddd)')  // 木
    : d.format('ddd, D MMM YYYY')   // Thu, 13 Feb 2025
}

/* ───── 2. Page Component ───── */
export default async function EventDetail({
  params,
}: {
  params: { id: string; locale: string }
}) {
  const ev = await getEventById(params.id, params.locale)
  if (!ev) notFound()

  /* date 表示 */
  const dateText =
  ev.date_end && ev.date_end !== ev.date_start
    ? `${formatDateWithWeekday(ev.date_start, params.locale)} 〜 ${formatDateWithWeekday(
        ev.date_end,
        params.locale,
      )}`
    : formatDateWithWeekday(ev.date_start, params.locale)

  return (
    <main className={`bg-white ${shippori.className}`}>
      <article className="mx-auto max-w-4xl space-y-12 px-6 py-16">
        {/* ───── タグ ───── */}
        <div className="mb-6 flex gap-4">
          <span
            className={`inline-block rounded px-3 py-1 text-sm font-medium ${kindColor(
              ev.event_kind,
            )}`}
          >
            {kindLabel(ev.event_kind, params.locale)}
          </span>
          <span
            className={`inline-block rounded border px-3 py-1 text-sm font-medium ${badgeColor(
              ev.participation_tag,
            )}`}
          >
            {tagLabel(ev.participation_tag.trim(), params.locale)}
          </span>
        </div>

        {/* ───── タイトル & 罫線 ───── */}
        <h1 className="text-3xl font-semibold tracking-wide">{ev.title}</h1>
        <hr className="border-gray-300" />

        {/* ───── 基本情報 ───── */}
        <section className="border border-gray-200">
          <div className="flex">
            {/* 灰縦棒 */}
            <span className="my-5 ml-5 w-1 bg-gray-300/70" />
            <dl className="grid flex-1 grid-cols-[6rem_1fr] gap-y-4 px-3 py-4">
              <dt className="bg-gray-100 px-3 py-2 font-medium text-gray-600">
                {params.locale === 'ja' ? '開催日' : 'Date'}
              </dt>
              <dd className="pl-5 py-2 font-light ">{dateText}</dd>

              {ev.time && (
                <>
                  <dt className="bg-gray-100 px-3 py-2 font-medium text-gray-600">
                    {params.locale === 'ja' ? '時間' : 'Time'}
                  </dt>
                  <dd className="pl-5 py-2 font-light">{ev.time}</dd>
                </>
              )}

              {ev.location && (
                <>
                  <dt className="bg-gray-100 px-3 py-2 font-medium text-gray-600">
                    {params.locale === 'ja' ? '場所' : 'Place'}
                  </dt>
                  <dd className="pl-5 py-2 font-light">{ev.location}</dd>
                </>
              )}
            </dl>
          </div>
        </section>

        {/* ───── 本文 (Strapi Blocks) ───── */}
        {ev.description && <BlockRendererClient content={ev.description} />}

        {/* ───── 画像ギャラリー ───── */}
        {/* {ev.images?.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {ev.images.map(({ url }) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={url} src={url} alt={ev.title} className="w-full rounded-lg" />
            ))}
          </div>
        ) : null} */}

        {/* ───── 戻るリンク ───── */}
        <div className="flex w-full justify-center">
          <Link
            href={`/${params.locale}/events`}
            className="mb-10 inline-flex items-center gap-2 rounded-lg bg-gray-100 px-6 py-3 text-gray-700 shadow-sm transition-colors hover:bg-gray-200 hover:text-gray-900"
          >
            <span className="text-lg">←</span>
            {params.locale === 'ja' ? '行事一覧に戻る' : 'Back to all events'}
          </Link>
        </div>
      </article>
    </main>
  )
}
