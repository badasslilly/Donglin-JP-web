import { factories } from '@strapi/strapi'

const UID = 'api::offering-request.offering-request' as const
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export default factories.createCoreController(UID, ({ strapi }) => ({
  async submit(ctx) {
    // ---- header secret (fixed) ----
    const headers = ctx.request.header || ctx.request.headers
    const secret =
      (headers['x-app-secret'] as string | undefined) ??
      (headers['X-App-Secret'] as string | undefined) ??
      ''

    if (!secret || secret !== process.env.STRAPI_FORM_SECRET) {
      return ctx.badRequest('Invalid secret')
    }

    // ---- body parsing ----
    const body = (ctx.request as any).body || {}
    const {
      method, name, email, address, note, item_id, item_title, locale,
    } = body

    if (!method || !name || !email) return ctx.badRequest('Missing required fields')
    if (!['in_person', 'mail'].includes(method)) return ctx.badRequest('Invalid method')
    if (!EMAIL_RE.test(email)) return ctx.badRequest('Invalid email')

    // optional: generate a redeem code if you actually use it
    const redeem_code = undefined

    // ---- save to Strapi (v5 Document Service) ----
    const created = await strapi
      .documents(UID)
      .create({
        data: {
          method,
          name,
          email,
          address,
          note,
          item_id,
          item_title,
          locale,
          status: 'new',
          redeem_code,
        },
      })

    // ---- send emails via Strapi Email plugin ----
    // v5 still supports plugin service calls like this:
    const emailSvc = (strapi.plugin('email').service('email') as any)

    const templeEmail = process.env.TEMPLE_INBOX || 'info@example.com'

    // Admin/temple notification
    await emailSvc.send({
      to: templeEmail,
      subject: `[Offering Request] ${item_title ?? ''} — ${name}`,
      text: `New offering request:
Item: ${item_title ?? '-'}
Method: ${method}
Name: ${name}
Email: ${email}
Address: ${address ?? '-'}
Note: ${note ?? '-'}
Locale: ${locale ?? '-'}
`,
    })

    // User confirmation
    const subjectUser =
      locale === 'en' ? 'Your offering request has been received' : 'お申込みを受け付けました'
    const textUser =
      locale === 'en'
        ? `Dear ${name},

Thank you for your offering request. We have received the following details:
- Item: ${item_title ?? '-'}
- Method: ${method === 'mail' ? 'Mail' : 'Pick up at temple'}

We will contact you shortly.
`
        : `${name} 様

結縁品のお申込みありがとうございます。以下の内容で受け付けました。
・品名：${item_title ?? '-'}
・方法：${method === 'mail' ? '郵送' : '現地受取'}

追って担当者よりご連絡いたします。
`

    await emailSvc.send({
      to: email,
      subject: subjectUser,
      text: textUser,
    })

    ctx.body = { ok: true, code: redeem_code }
  },
}))
