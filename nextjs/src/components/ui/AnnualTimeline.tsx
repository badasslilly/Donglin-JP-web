/** @format */

import clsx from 'clsx'
import dayjs from 'dayjs'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { badgeColor, kindColor, kindLabel, tagLabel } from '@/data/kinds'

/* -------------------------------------------------------- */
/* Types                                                    */
/* -------------------------------------------------------- */
export interface AnnualEvent {
  id: number | string
  month: number // 1-12
  date_start: string // ISO
  date_end?: string | null
  event_kind: string
  participation_tag: string
  title: string
  location?: string | null
}

/* -------------------------------------------------------- */
/* Component                                                */
/* -------------------------------------------------------- */
export default function AnnualTimeline({
  events,
  locale,
}: {
  events: AnnualEvent[]
  locale: string
}) {
  // group by month
  const byMonth = events.reduce<Record<number, AnnualEvent[]>>((acc, ev) => {
    ;(acc[ev.month] ||= []).push(ev)
    return acc
  }, {})

  return (
    <section className='space-y-6'>
      {Object.entries(byMonth).map(([m, list]) => {
        const month = Number(m)

        return (
          <article
            id={`month${month}`}
            key={month}
            className='mb-4 grid grid-cols-1 gap-x-2 md:grid-cols-[5rem_1fr]'
          >
            {/* --- Mobile month bar (full width, mobile-only) --- */}
            <div className='md:hidden mb-3'>
              <div className='w-full bg-gray-100 px-4 py-3 text-xl font-semibold'>
                {month}月
              </div>
            </div>
            {/* --- Desktop month block (sticky) --- */}
            <div className='relative hidden bg-gray-50 md:block'>
              <div className='absolute right-0 top-0 h-full w-px bg-gray-300' />
              <h3 className='sticky top-[88px] py-1 pl-4 text-xl font-semibold'>
                {month}月
              </h3>
            </div>
            {/* --- Events list with vertical rail & dots --- */}
            <ul className='relative'>
              {/* Mobile: one continuous spine for the whole month */}
              <span
                aria-hidden
                className='absolute left-4 top-0 bottom-0 w-px bg-gray-300 md:hidden'
              />
              {list.map((ev, idx) => {
                return (
                  <li
                    key={ev.id}
                    className='relative transition-colors hover:bg-[#f8f6fd] pl-10 md:pl-0 '
                  >
                    
                    <span
                      aria-hidden
                      className='absolute left-4 md:left-[-8px] top-6 md:top-11 h-2 w-2 -translate-x-1/2 rounded-full bg-gray-600'
                    />
                    <Link
                      href={`/events/${ev.id}`}
                      className='grid grid-cols-1 items-stretch gap-y-3 gap-x-8 py-4 md:grid-cols-[10.5rem_1fr_auto]'
                    >
                      {/* date column */}
                      <div className='flex items-center whitespace-nowrap md:pl-5'>
                        <time className='text-base text-gray-900'>
                          {formatDate(ev, locale)}
                        </time>
                      </div>
                      {/* info block */}
                      <div className='grid grid-cols-1 gap-y-3 gap-x-8 md:grid-cols-[9rem_minmax(0,1fr)]'>
                        <div className='flex gap-2 md:block md:space-y-2 md:border-l md:border-r md:border-gray-300 md:px-8 md:text-center'>
                          <span
                            className={clsx(
                              'inline-block rounded py-1 px-3 md:px-0 tracking-widest text-[11px] md:text-[12px] font-semibold md:w-full',
                              kindColor(ev.event_kind)
                            )}
                          >
                            {kindLabel(ev.event_kind, locale)}
                          </span>
                          <span
                            className={clsx(
                              'inline-block rounded border py-1 px-3 md:px-0 tracking-widest text-[10px] md:text-[11px] font-medium md:w-full',
                              badgeColor(ev.participation_tag)
                            )}
                          >
                            {tagLabel(ev.participation_tag, locale)}
                          </span>
                        </div>
                        {/* title + place */}
                        <div className='space-y-1 md:pl-5'>
                          <h4 className='text-[15px] font-medium leading-7 md:leading-8'>
                            {ev.title}
                          </h4>
                          {ev.location && (
                            <p className='flex items-center gap-3 text-xs text-gray-900'>
                              <span className='inline-block bg-gray-100 px-3 py-1 tracking-widest font-semibold'>
                                {locale === 'ja' ? '場所' : 'Place'}
                              </span>
                              <span>{ev.location}</span>
                            </p>
                          )}
                        </div>
                      </div>
                      {/* chevron */}
                      <div className='flex items-center pr-4 absolute right-2 top-1/2 -translate-y-1/2  '>
                        <ChevronRight className='h-4 w-4 text-purple-600' />
                      </div>
                    </Link>
                    <span
                      aria-hidden
                      className='pointer-events-none absolute bottom-0 right-0 h-px bg-gray-200
               left-10 md:left-0' // phone: align with pl-10; desktop: after the 5rem date column
                    />
                  </li>
                )
              })}
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
function formatDate(ev: AnnualEvent, locale: string = 'ja') {
  const start = dayjs(ev.date_start)
  const end   = ev.date_end ? dayjs(ev.date_end) : null

  // single-day
  if (!end || end.isSame(start, 'day')) {
    return locale === 'ja' ? start.format('D日') : start.format('D')
  }

  // build end label: add month if month changed; add year if year changed
  const endLabel =
    !end.isSame(start, 'year')
      ? (locale === 'ja' ? end.format('YYYY年M月D日') : end.format('YYYY MMM D'))
      : !end.isSame(start, 'month')
        ? (locale === 'ja' ? end.format('M月D日') : end.format('MMM D'))
        : (locale === 'ja' ? end.format('D日') : end.format('D'))

  const startLabel = locale === 'ja' ? start.format('D日') : start.format('D')
  return `${startLabel}〜${endLabel}`
}

