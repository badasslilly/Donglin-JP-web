/** @format */

import HeroHeader from '@/components/ui/HeroHeader'
import PageTabs from '@/components/ui/PageTabs'
import { shippori } from '@/styles/fonts'
import AnnualTimeline, { AnnualEvent } from '@/components/ui/AnnualTimeline'
import MonthMenu from '@/components/ui/MonthMenu'
import Legend from '@/components/ui/Legend'
import EventTabs from '@/components/ui/EventTabs'
import { getAllEvents } from '@/lib/strapi'

// export const annualEvents2025: AnnualEvent[] = [
//   {
//     id: 1,
//     month: 3,
//     date_start: '2025-03-14',
//     date_end: null,
//     event_kind: '法要・行事',
//     participation_tag: 'おまいり',
//     title: '釈尊涅槃供法会',
//     place: '東林寺',
//   },
//   {
//     id: 2,
//     month: 4,
//     date_start: '2025-04-30',
//     date_end: '2025-05-07',
//     event_kind: '修行',
//     participation_tag: '申込が必要',
//     title: 'ゴールデンウイーク7日間精進念仏',
//     place: '東林寺と浄土寺',
//   },
//   {
//     id: 3,
//     month: 5,
//     date_start: '2025-05-05',
//     date_end: null,
//     event_kind: '法要・行事',
//     participation_tag: 'おまいり',
//     title: '釈尊降誕会',
//     place: '東林寺と浄土寺',
//   },
//   {
//     id: 4,
//     month: 5,
//     date_start: '2025-05-21',
//     date_end: '2025-05-25',
//     event_kind: '講座',
//     participation_tag: '申込が必要',
//     title: '在家菩薩戒の伝授式（三帰依五戒含む）',
//     place: '東林寺と浄土寺',
//   },
//   // …add as many samples as you like
// ]

export function toMonthNumber(raw?: string | null): number | undefined {
  if (!raw) return
  const m = raw.replace(/^month-/, '') // プレフィックス除去
  const n = Number(m)
  return n >= 1 && n <= 12 ? n : undefined // バリデート
}

export default async function Events({
  params,
}: {
  params: { locale: string }
}) {
  const strapiEvents = await getAllEvents(params.locale)

  const annualEvents: AnnualEvent[] = strapiEvents.map((ev) => {
    const monthNum =
      toMonthNumber(ev.month) ?? new Date(ev.date_start).getMonth() + 1

    return {
      id: ev.id,
      month: monthNum,
      date_start: ev.date_start,
      date_end: ev.date_end,
      event_kind: ev.event_kind,
      participation_tag: ev.participation_tag.trim(),
      title: ev.title,
      location: ev.location ?? '',
    }
  })

  const monthsWithEvents = Array.from(
    new Set(annualEvents.map((e) => e.month).filter(Boolean))
  ) as number[]

  return (
    <div
      className={`mx-auto max-w-6xl px-4 pt-15 pb-14 space-y-14 ${shippori.className} font-semibold`}
    >
      <Legend />

      <h2 className='mb-4 border-b border-gray-300 pt-5 pb-3 text-2xl font-semibold tracking-widest'>
        年間行事
      </h2>

      <MonthMenu activeMonths={monthsWithEvents} />
      <AnnualTimeline events={annualEvents} locale={params.locale} />
    </div>
  )
}
