/** @format */

import { shippori } from '@/styles/fonts'
import AnnualTimeline, { AnnualEvent } from '@/components/ui/AnnualTimeline'
import MonthMenu from '@/components/ui/MonthMenu'
import Legend from '@/components/ui/Legend'
import { getAllEvents, Locale } from '@/lib/strapi'
import type { WithAsyncRequest } from '@/utils/next-async-props'

// Added by fix-async-props codemod
type PagePropsSync = { params?: any; searchParams?: any };
type PageProps = WithAsyncRequest<PagePropsSync>


function toMonthNumber(raw?: string | null): number | undefined {
  if (!raw) return
  const m = raw.replace(/^month-/, '')
  const n = Number(m)
  return n >= 1 && n <= 12 ? n : undefined
}

export default async function EventsPage(props: PageProps) {
  // ✅ Next 15: await params
  const { locale } = await props.params

  const strapiEvents = await getAllEvents(locale)

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
      <Legend locale={locale} />

      <h2 className='mb-4 border-b border-gray-300 pt-5 pb-3 text-2xl font-semibold tracking-widest'>
        年間行事
      </h2>

      <MonthMenu activeMonths={monthsWithEvents} locale={locale} />
      <AnnualTimeline events={annualEvents} locale={locale} />
    </div>
  )
}
