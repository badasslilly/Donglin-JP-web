// src/app/analytics/page.tsx
export const dynamic = 'force-dynamic';

import { analyticsPool } from '@/lib/pg-analytics';
import dayjs from 'dayjs';

type EventRow = {
  occurred_at: string;
  path: string;
  referrer: string | null;
  locale: string | null;
  visitor_id: string | null;
  iphash: string; // prefix
  ua: string | null;
  country: string | null; // e.g. "JP"
  region: string | null;
  city: string | null;
};

function short(str: string | null | undefined, n = 40) {
  if (!str) return '—';
  return str.length > n ? str.slice(0, n - 1) + '…' : str;
}
function shortUUID(u: string | null) {
  if (!u) return '—';
  return u.split('-')[0];
}
function hostFromRef(ref: string | null) {
  if (!ref) return '—';
  try { return new URL(ref).host; } catch { return short(ref, 28); }
}
function countryToFlag(cc?: string | null) {
  if (!cc || cc.length !== 2) return '🏳️';
  const code = cc.toUpperCase();
  // Convert A..Z to regional indicator symbols
  const A = 0x41, RI = 0x1f1e6;
  return String.fromCodePoint(...code.split('').map(c => RI + (c.charCodeAt(0) - A)));
}
function fmt(n: number) {
  return n.toLocaleString('en-US');
}

async function getRecent(): Promise<{ rows: EventRow[]; totals: { pv: number; uv: number; ip: number } }> {
  const { rows } = await analyticsPool.query<EventRow>(
    `
    select
      occurred_at,
      path,
      referrer,
      locale,
      visitor_id::text as visitor_id,
      left(ip_hash, 12) as iphash,
      ua,
      country, region, city
    from analytics.page_events
    where not is_bot
    order by id desc
    limit 200
    `
  );
  const { rows: t } = await analyticsPool.query<{ pv: number; uv: number; ip: number }>(
    `
    select
      count(*)::int as pv,
      count(distinct visitor_id)::int as uv,
      count(distinct ip_hash)::int as ip
    from analytics.page_events
    where not is_bot
      and occurred_at >= date_trunc('day', now())
    `
  );
  return { rows, totals: t[0] ?? { pv: 0, uv: 0, ip: 0 } };
}

export default async function AnalyticsPage() {
  const { rows, totals } = await getRecent();

  return (
    <main className="mx-auto max-w-7xl p-6 space-y-8">
      <h1 className="text-2xl font-bold">Access Log（the lateset 200 items／real time）</h1>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-500">total today</div>
          <div className="mt-1 space-y-1">
            <div><span className="inline-block w-12 text-gray-600">PV</span> <span className="font-semibold">{fmt(totals.pv)}</span></div>
            <div><span className="inline-block w-12 text-gray-600">UV</span> <span className="font-semibold">{fmt(totals.uv)}</span></div>
            <div><span className="inline-block w-12 text-gray-600">IP</span> <span className="font-semibold">{fmt(totals.ip)}</span></div>
          </div>
        </div>
        <div className="p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-500">current time</div>
          <div className="text-lg font-semibold">{dayjs().format('YYYY-MM-DD HH:mm:ss')}</div>
        </div>
        <div className="p-4 rounded-2xl shadow">
          <div className="text-sm text-gray-500">number of items</div>
          <div className="text-lg font-semibold">{rows.length}</div>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Recent Events</h2>
        <div className="overflow-x-auto rounded-2xl border">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">Path</th>
                <th className="px-3 py-2">Location</th>
                <th className="px-3 py-2">Visitor</th>
                <th className="px-3 py-2">Referrer</th>
                <th className="px-3 py-2">UA</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const flag = countryToFlag(r.country);
                const locText = r.country ? `${r.country}${r.city ? ' / ' + r.city : r.region ? ' / ' + r.region : ''}` : '—';
                return (
                  <tr key={i} className="border-t">
                    <td className="px-3 py-2 whitespace-nowrap">{dayjs(r.occurred_at).format('YYYY-MM-DD HH:mm:ss')}</td>
                    <td className="px-3 py-2">{r.path}</td>
                    <td className="px-3 py-2">{flag} <span className="align-middle ml-1">{locText}</span></td>
                    <td className="px-3 py-2">{shortUUID(r.visitor_id)} <span className="text-xs text-gray-400">({r.iphash})</span></td>
                    <td className="px-3 py-2">{hostFromRef(r.referrer)}</td>
                    <td className="px-3 py-2">{short(r.ua)}</td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr><td className="px-3 py-8 text-center text-gray-500" colSpan={6}>No data yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

