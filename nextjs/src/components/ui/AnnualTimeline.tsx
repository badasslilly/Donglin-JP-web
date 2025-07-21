/** @format */

import clsx from 'clsx'
import dayjs from 'dayjs'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { badgeColor, kindColor } from './badgeColor'

/* -------------------------------------------------------- */
/* Type                                                     */
/* -------------------------------------------------------- */
export interface AnnualEvent {
  id: number | string
  month: number            // 1-12
  date_start: string       // ISO
  date_end?: string | null
  event_kind: string
  participation_tag: string
  title: string
  place?: string | null
}

/* -------------------------------------------------------- */
/* Component                                                */
/* -------------------------------------------------------- */
export default function AnnualTimeline({ events }: { events: AnnualEvent[] }) {
  /* group by month */
  const byMonth = events.reduce<Record<number, AnnualEvent[]>>((acc, ev) => {
    (acc[ev.month] ||= []).push(ev)
    return acc
  }, {})

  return (
    <section>
      {Object.entries(byMonth).map(([m, list]) => {
        const month = Number(m)
        return (
          <article
            id={`month${month}`}
            key={month}
            className="grid grid-cols-[5rem_1fr] gap-x-2 mb-4"
          >
            {/* month block + rail */}
            <div className="relative bg-gray-50">
              <div className="absolute right-0 top-0 h-full w-px bg-gray-300" />
              <h3 className="sticky top-[88px] pl-4 py-1 text-xl font-semibold">
                {month}月
              </h3>
            </div>

            {/* events list */}
            <ul>
              {list.map(ev => (
                /* li is JUST a wrapper (no grid) */
                <li
                  key={ev.id}
                  className="relative border-b border-gray-200 hover:bg-[#f8f6fd] transition-colors"
                >
                  {/* entire row is a link */}
                  <Link
                    href={`/events/${ev.id}`}
                    className="grid grid-cols-[5rem_1fr_auto] gap-x-8 items-stretch py-4"
                  >
                    {/* date column */}
                    <div className="flex items-center whitespace-nowrap pl-3">
                      <time className="text-base text-gray-900">
                        {formatDate(ev)}
                      </time>
                    </div>

                    {/* info block */}
                    <div className="grid grid-cols-[9rem_minmax(0,1fr)] gap-x-8">
                      {/* kind + tag */}
                      <div className="space-y-2 px-8 border-l border-r border-gray-300 text-center">
                        <span
                          className={clsx(
                            'inline-block w-full py-1 text-[13px] font-semibold rounded',
                            kindColor(ev.event_kind)
                          )}
                        >
                          {ev.event_kind}
                        </span>
                        <span
                          className={clsx(
                            'inline-block w-full py-1 text-[12px] font-medium rounded border',
                            badgeColor(ev.participation_tag)
                          )}
                        >
                          {ev.participation_tag}
                        </span>
                      </div>

                      {/* title + place */}
                      <div className="space-y-1 pl-8">
                        <h4 className="text-[15px] font-medium leading-6">
                          {ev.title}
                        </h4>
                        {ev.place && (
                          <p className="text-xs text-gray-900 flex items-center gap-3">
                            <span className="inline-block px-3 py-1 bg-gray-100 font-semibold">
                              場所
                            </span>
                            <span>{ev.place}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* arrow */}
                    <div className="flex items-center pr-4">
                      <ChevronRight className="h-4 w-4 text-purple-600" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        )
      })}
    </section>
  )
}

/* -------------------------------------------------------- */
/* Helper                                                   */
/* -------------------------------------------------------- */
function formatDate(ev: AnnualEvent) {
  const from = dayjs(ev.date_start).format('D日')
  return ev.date_end && ev.date_end !== ev.date_start
    ? `${from}〜${dayjs(ev.date_end).format('D日')}`
    : from
}
