// src/app/api/track/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { analyticsPool } from '@/lib/pg-analytics';

const BOT_REGEX =
  /(bot|spider|crawler|preview|feedfetcher|facebookexternalhit|slurp|bingpreview|mastodon|embedly|quora link preview|whatsapp|telegrambot|discordbot)/i;

// ----- tiny cache to avoid hammering the API -----
type Geo = { country: string | null; region: string | null; city: string | null; at: number };
const GEO_TTL_MS = 6 * 60 * 60 * 1000; // 6h
const geoCache = new Map<string, Geo>();

function cacheGet(ip: string): Geo | null {
  const g = geoCache.get(ip);
  if (!g) return null;
  if (Date.now() - g.at > GEO_TTL_MS) { geoCache.delete(ip); return null; }
  return g;
}
function cacheSet(ip: string, g: Omit<Geo, 'at'>) {
  geoCache.set(ip, { ...g, at: Date.now() });
}

// ----- MaxMind Web Service (City) -----
// Docs: https://dev.maxmind.com/geoip/docs/web-services/requests/
// GET https://geoip.maxmind.com/geoip/v2.1/city/{IP}
// Auth: Basic (AccountID:LicenseKey)
async function maxmindCityWS(ip: string): Promise<Geo | null> {
  if (process.env.ENABLE_MAXMIND_WS !== '1') return null;
  if (!process.env.MAXMIND_ACCOUNT_ID || !process.env.MAXMIND_LICENSE_KEY) return null;

  const cached = cacheGet(ip);
  if (cached) return cached;

  const auth = Buffer
    .from(`${process.env.MAXMIND_ACCOUNT_ID}:${process.env.MAXMIND_LICENSE_KEY}`)
    .toString('base64');

  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 900); // 0.9s cap
  try {
    const url = `https://geoip.maxmind.com/geoip/v2.1/city/${encodeURIComponent(ip)}`;
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
      },
    });
    if (!res.ok) throw new Error(`MaxMind ${res.status}`);
    const j: any = await res.json().catch(() => ({}));

    const out: Geo = {
      country: (j?.country?.iso_code || null) ?? null,                       // e.g. "JP"
      region: (j?.subdivisions?.[0]?.names?.en || j?.subdivisions?.[0]?.iso_code || null) ?? null,
      city: (j?.city?.names?.en || null) ?? null,
      at: Date.now(),
    };
    cacheSet(ip, out);
    return out;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, via: 'GET' });
}

export async function POST(req: Request) {
  try {
    const salt = process.env.IP_HASH_SALT;
    if (!salt) return NextResponse.json({ ok: false, reason: 'no_salt' }, { status: 500 });

    const { path, referrer, locale, visitor_id } = await req.json().catch(() => ({} as any));
    if (!path || typeof path !== 'string') {
      return NextResponse.json({ ok: false, reason: 'bad_path' }, { status: 400 });
    }

    // Respect DNT
    if (req.headers.get('dnt') === '1') {
      return NextResponse.json({ ok: true, dnt: true });
    }

    // Real client IP: Cloudflare first, then XFF
    const cfip = req.headers.get('cf-connecting-ip') || '';
    const xff = req.headers.get('x-forwarded-for') || '';
    const ip = (cfip || xff.split(',')[0]).trim() || '0.0.0.0';

    const ua = req.headers.get('user-agent') || '';
    const is_bot = BOT_REGEX.test(ua);

    // ---- Geo enrichment ----
    let country: string | null = null, region: string | null = null, city: string | null = null;

    // A) Cloudflare country (instant, free)
    const cfCountry = req.headers.get('cf-ipcountry');
    if (cfCountry) country = cfCountry.toUpperCase();

    // B) MaxMind Web Service (City) — fills city/region and country if still empty
    if (ip && ip !== '0.0.0.0') {
      const g = await maxmindCityWS(ip);
      if (g) {
        country = country || g.country;
        region = region || g.region;
        city = city || g.city;
      }
    }

    // Hash IP (we never store the raw IP)
    const ip_hash = crypto.createHash('sha256').update(ip + salt).digest('hex');

    await analyticsPool.query(
      `insert into analytics.page_events
        (path, referrer, locale, visitor_id, ip_hash, ua, is_bot, country, region, city)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
      [path, referrer || null, locale || null, visitor_id || null, ip_hash, ua || null, is_bot, country, region, city]
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, reason: 'server_error' }, { status: 500 });
  }
}

