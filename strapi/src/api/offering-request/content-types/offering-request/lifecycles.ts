// src/api/offering-request/content-types/offering-request/lifecycles.ts

type Method = 'in_person' | 'mail' | 'digital';
type Lang = 'ja' | 'en';

type OfferingRequest = {
  item_id?: number | string;
  item_title?: string;
  method: Method;
  name?: string;
  email?: string;
  address?: string;
  note?: string;
  localization?: Lang; // ← you renamed to "localization"
  ip?: string;
  ua?: string;
};

const jpConfirm = (r: OfferingRequest) => `
このたびは東林寺の結縁品お申込みありがとうございます。以下の内容で受け付けました。

・品名: ${r.item_title ?? '-'}
・方法: ${r.method}
・お名前: ${r.name ?? '-'}
・ご住所: ${r.address ?? '-'}

本メールは自動送信です。ご不明点があれば本メールにご返信ください。
`;

const enConfirm = (r: OfferingRequest) => `
Thank you for your Donglin offering request. We have received the following:

• Item: ${r.item_title ?? '-'}
• Method: ${r.method}
• Name: ${r.name ?? '-'}
• Address: ${r.address ?? '-'}

This is an automated message. If you have any questions, please reply to this email.
`;

export default {
  async afterCreate(event: { result: OfferingRequest }) {
    const r = event.result;
    const emailService = strapi.plugin('email').service('email');

    const lang = r.localization ?? 'ja';
    const isJa = lang === 'ja';

    try {
      // Admin notification
      await emailService.send({
        to: process.env.MAIL_TO_ADMIN!,
        subject: `New offering request: ${r.item_title ?? ''}`,
        text: [
          `Method: ${r.method}`,
          `Localization: ${lang}`,
          `Name: ${r.name ?? ''}`,
          `Email: ${r.email ?? ''}`,
          `Address: ${r.address ?? ''}`,
          `Item: ${r.item_title ?? ''} (ID: ${r.item_id ?? ''})`,
          `Note: ${r.note ?? ''}`,
          `IP: ${r.ip ?? ''}`,
          `UA: ${r.ua ?? ''}`,
        ].join('\n'),
      });

      // User confirmation
      if (r.email) {
        await emailService.send({
          to: r.email,
          subject: isJa
            ? '【東林寺】結縁品お申込みを受け付けました'
            : 'Donglin Monastery — Offering Request Received',
          text: isJa ? jpConfirm(r) : enConfirm(r),
        });
      }
    } catch (err) {
      strapi.log.error('Email send failed (offering-request): ' + (err as Error).message);
    }
  },
};

