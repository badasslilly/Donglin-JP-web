import { Resend } from 'resend';
import { render } from '@react-email/render';

import { NextResponse } from 'next/server';

import OfferingConfirm from '@/email/OfferingConfirm';
import { adminText } from '@/email/plain';
import React from 'react';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // ... your existing assertValid, STRAPI_URL/TOKEN, POST to Strapi, etc.

    // If Strapi created successfully, send emails via Resend
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.RESEND_FROM!;
    const admin = process.env.MAIL_TO_ADMIN!;
    const uiLang = (body.localization ?? body.locale ?? 'ja') as 'ja' | 'en';

    // 1) Admin notification (plain text is fine)
    await resend.emails.send({
      from,
      to: admin,
      subject: `New offering request: ${body.item_title ?? ''}`,
      text: adminText({
        ...body,
        ip: req.headers.get('x-forwarded-for') ?? '',
        ua: req.headers.get('user-agent') ?? '',
      }),
    });

    // 2) User confirmation (React Email template)
    const html = await render(
      React.createElement(OfferingConfirm, {
        lang: uiLang,
        item_title: body.item_title,
        method: body.method,
        name: body.name,
        address: body.address,
      })
    );

    await resend.emails.send({
      from: from,
      to: body.email, // ensure it's validated by your own checks
      subject:
        uiLang === 'ja'
          ? '【東林寺】結縁品お申込みを受け付けました'
          : 'Donglin Monastery — Offering Request Received',
      html,
      // you can add a text fallback if you like:
      // text: plainConfirm(uiLang, body)
    });

    return NextResponse.json({ ok: true /*, id: createdId */ });
  } catch (err: any) {
    console.error('[offering-request] Route error', err);
    return NextResponse.json({ ok: false, error: err?.message || 'Bad request' }, { status: 400 });
  }
}
