import { NextResponse } from 'next/server';

type Method = 'in_person' | 'mail' | 'digital';
type Lang = 'ja' | 'en';

type Payload = {
  item_id?: number | string;
  item_title?: string;
  method: Method;
  name?: string;
  email?: string;
  address?: string;
  note?: string;
  localization?: Lang; // you renamed to "localization"
  locale?: Lang;       // fallback for old clients
};

function assertValid(p: Payload) {
  const e: string[] = [];
  if (!p.method || !['in_person', 'mail', 'digital'].includes(p.method)) e.push('Invalid method');
  if (p.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(p.email)) e.push('Invalid email');
  if (p.method === 'mail' && !p.address) e.push('Address required for mail');
  if (e.length) throw new Error(e.join('; '));
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;
    assertValid(body);

    const localization = body.localization ?? body.locale ?? 'ja';
    const ip = req.headers.get('x-forwarded-for') ?? '';
    const ua = req.headers.get('user-agent') ?? '';

    const url = `${process.env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/+$/, '')}/api/offering-requests`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({
        data: {
          item_id: body.item_id,
          item_title: body.item_title,
          method: body.method,
          name: body.name,
          email: body.email,
          address: body.address,
          note: body.note,
          localization,
          ip,
          ua,
        },
      }),
    });

    const text = await resp.text();
    if (!resp.ok) {
      console.error('[offering-request] Strapi error', resp.status, text);
      return NextResponse.json(
        { ok: false, status: resp.status, error: text || resp.statusText },
        { status: resp.status }
      );
    }
    const json = text ? JSON.parse(text) : {};
    return NextResponse.json({ ok: true, id: json?.data?.id });
  } catch (err: any) {
    console.error('[offering-request] Route error', err);
    return NextResponse.json(
      { ok: false, error: err?.message || 'Bad request' },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, route: 'site-api/offering-request' });
}