/** @format */

import HeroHeader from '@/components/ui/HeroHeader'
import PageTabs from '@/components/ui/PageTabs'
import { shippori } from '@/styles/fonts'
import AnnualTimeline, { AnnualEvent } from '@/components/ui/AnnualTimeline'
import MonthMenu from '@/components/ui/MonthMenu'
import Legend from '@/components/ui/Legend'
import EventTabs from '@/components/ui/EventTabs'

export const annualEvents2025: AnnualEvent[] = [
  {
    id: 1,
    month: 3,
    date_start: '2025-03-14',
    date_end: null,
    event_kind: '法要・行事',
    participation_tag: 'おまいり',
    title: '釈尊涅槃供法会',
    place: '東林寺',
  },
  {
    id: 2,
    month: 4,
    date_start: '2025-04-30',
    date_end: '2025-05-07',
    event_kind: '修行',
    participation_tag: '申込が必要',
    title: 'ゴールデンウイーク7日間精進念仏',
    place: '東林寺と浄土寺',
  },
  {
    id: 3,
    month: 5,
    date_start: '2025-05-05',
    date_end: null,
    event_kind: '法要・行事',
    participation_tag: 'おまいり',
    title: '釈尊降誕会',
    place: '東林寺と浄土寺',
  },
  {
    id: 4,
    month: 5,
    date_start: '2025-05-21',
    date_end: '2025-05-25',
    event_kind: '講座',
    participation_tag: '申込が必要',
    title: '在家菩薩戒の伝授式（三帰依五戒含む）',
    place: '東林寺と浄土寺',
  },
  // …add as many samples as you like
]

const monthsWithEvents = Array.from(
  new Set(annualEvents2025.map(e => e.month))
) as number[]  

export default function Events() {
  return (
    <main
      className={`min-h-screen bg-white text-gray-900 ${shippori.className} font-semibold`}
    >
      {/* ─────────── Hero ─────────── */}
      <HeroHeader
        bgSrc={'/imgs/sub-pages/event.jpg'}
        title={'行事・体験'}
        subtitle='events'
      />
      {/* ─────────── Tabs ─────────── */}
      <div className='mx-auto max-w-6xl px-4 pt-15 pb-14 space-y-14'>
      <Legend />
      {/* <EventTabs active="annual" /> */}
        {/* headings etc. */}
        <h2 className='mb-4 text-2xl font-semibold border-b border-gray-300 pt-5 pb-3 tracking-widest'>2025年 年間行事</h2>

        <MonthMenu activeMonths={monthsWithEvents}/>
        {/* ↑ month links */}
        <AnnualTimeline events={annualEvents2025} />
      </div>
    </main>
  )
}
