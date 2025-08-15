import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

type ContactConfig = {
  cat?: string[];            // radios
  desired?: string[];        // radios
  name?: string;             // label
  email?: string;            // label (we just treat as string)
  comment?: any;             // rich text blocks; we only need a label → optional
  age?: string[];            // select
  gender?: string[];         // radios
  enquete_cat?: string[];    // radios
  reason?: string[];         // checkboxes
  evaluation1?: string[];    // radios
  evaluation_cmt?: string;   // label for comment box
  enquete_cmt?: string;      // label for free comment box
  email_receiver?: string;   // add this field in Strapi if you want; otherwise use env fallback
  email_subject_prefix?: string;
};

type ContactBody = {
  locale?: 'ja' | 'en';

  cat: string;
  desired: string;
  name: string;
  tel: string;
  email: string;
  email2: string;
  comment: string;

  age?: string;
  gender?: string;
  enquete_cat?: string;
  reason?: string[];
  evaluation1?: string;
  evaluation_cmt1?: string;  // keep same client key for simplicity
  enquete_cmt?: string;

  website?: string;          // honeypot
};

const STRAPI_URL = process.env.STRAPI_URL!;
const STRAPI_TOKEN = process.env.STRAPI_TOKEN; // optional private read

function pickLocale(req: NextRequest, hint?: string): 'ja' | 'en' {
  const l = (hint || req.headers.get('x-locale') || req.headers.get('accept-language') || '').toLowerCase();
  if (l.startsWith('en')) return 'en';
  return 'ja';
}

async function getContactConfig(locale: 'ja' | 'en'): Promise<ContactConfig> {
  // Single type
  const url = new URL('/api/contact-form', STRAPI_URL);
  url.searchParams.set('locale', locale);

  const headers: Record<string, string> = {};
  if (STRAPI_TOKEN) headers.Authorization = `Bearer ${STRAPI_TOKEN}`;

  const res = await fetch(url.toString(), { headers, cache: 'no-store' });
  if (!res.ok) throw new Error(`Strapi load failed: ${res.status}`);
  const json = await res.json();
  return json?.data?.attributes ?? {};
}

function assertRequired(b: ContactBody) {
  const req = ['cat', 'desired', 'name', 'tel', 'email', 'email2', 'comment'] as const;
  const missing = req.filter((k) => !b[k] || (typeof b[k] === 'string' && (b[k] as string).trim() === ''));
  if (missing.length) throw new Error(`Missing fields: ${missing.join(', ')}`);
  if (b.email !== b.email2) throw new Error('Emails do not match');
  if (b.website) throw new Error('Spam detected');
}

function subject(prefix: string | undefined, locale: 'ja' | 'en', cat: string) {
  const p = prefix ?? (locale === 'en' ? '[Contact]' : '[お問い合わせ]');
  return `${p} ${cat}`.trim();
}

function buildMail(locale: 'ja' | 'en', b: ContactBody) {
  if (locale === 'en') {
    return `
Category: ${b.cat}
Topic: ${b.desired}
Name: ${b.name}
Phone: ${b.tel}
Email: ${b.email}

Message:
${b.comment}

--- Optional Survey ---
Age: ${b.age || ''}
Gender: ${b.gender || ''}
Affiliation: ${b.enquete_cat || ''}
Reasons: ${(b.reason || []).join(', ')}

Evaluation: ${b.evaluation1 || ''}
Evaluation comment:
${b.evaluation_cmt1 || ''}

Other comments:
${b.enquete_cmt || ''}`.trim();
  }
  return `
カテゴリ: ${b.cat}
項目: ${b.desired}
お名前: ${b.name}
電話番号: ${b.tel}
メール: ${b.email}

お問合わせ内容:
${b.comment}

--- アンケート ---
年齢: ${b.age || ''}
性別: ${b.gender || ''}
区分: ${b.enquete_cat || ''}
アクセス理由: ${(b.reason || []).join(', ')}

評価: ${b.evaluation1 || ''}
評価コメント:
${b.evaluation_cmt1 || ''}

その他ご意見:
${b.enquete_cmt || ''}`.trim();
}

function mailer() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ContactBody;
    const locale = pickLocale(req, body.locale);
    assertRequired(body);

    const cfg = await getContactConfig(locale);
    const to = cfg.email_receiver || process.env.CONTACT_FALLBACK_RECEIVER;
    if (!to) return NextResponse.json({ error: 'No receiver configured' }, { status: 500 });

    const text = buildMail(locale, body);
    const transporter = mailer();

    await transporter.sendMail({
      from: process.env.MAIL_FROM || 'no-reply@localhost',
      to,
      replyTo: body.email,
      subject: subject(cfg.email_subject_prefix, locale, body.cat),
      text,
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    const msg = typeof e?.message === 'string' ? e.message : 'Server error';
    const status = /Missing|match|Spam/.test(msg) ? 400 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}
