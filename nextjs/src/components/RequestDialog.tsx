/** @format */
'use client'

import { useState } from 'react'

type Method = 'in_person' | 'mail'
type Locale = 'ja' | 'en'

export default function RequestDialog({
  item,
  locale = 'ja',
  initialMethod = 'in_person',
  onClose,
}: {
  item: any
  locale?: Locale
  initialMethod?: Method
  onClose: () => void
}) {
  const a = item?.attributes ?? item ?? {}
  const bothAvailable = !!a.has_mail && !!a.has_in_person

  const [method, setMethod] = useState<Method>(initialMethod)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState<{ code?: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  function validateEmail(v: string) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)
  }

  function buildAddressString(fd: FormData, lang: Locale) {
    // map your current field names
    const country = fd.get('country')?.toString().trim()
    const postal = fd.get('postal_code')?.toString().trim()
    const pref = fd.get('state_or_pref')?.toString().trim() // you used this name
    const city = fd.get('city')?.toString().trim()
    const a1 = fd.get('address1')?.toString().trim()
    const a2 = fd.get('address2')?.toString().trim()

    if (lang === 'ja') {
      // JP-ish order
      return [postal && `〒${postal}`, pref, city, a1, a2, country]
        .filter(Boolean)
        .join(' ')
    }
    // EN-ish
    return [a1, a2, city, pref, postal, country].filter(Boolean).join(', ')
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const fd = new FormData(e.currentTarget)

    const name = fd.get('name')?.toString().trim() || ''
    const email = fd.get('email')?.toString().trim() || ''
    const note = fd.get('notes')?.toString().trim() || '' // your field is "notes"

    // basic validation
    if (!name || !email) {
      setError(
        locale === 'ja'
          ? '必須項目が未入力です。'
          : 'Required fields are missing.'
      )
      return
    }
    if (!validateEmail(email)) {
      setError(
        locale === 'ja'
          ? 'メールアドレスの形式が正しくありません。'
          : 'Invalid email format.'
      )
      return
    }

    let address: string | undefined = undefined
    if (method === 'mail') {
      // required for mail
      const required = ['country', 'postal_code', 'city', 'address1']
      for (const k of required) {
        const v = fd.get(k)?.toString().trim()
        if (!v) {
          setError(
            locale === 'ja'
              ? '必須項目が未入力です。'
              : 'Required fields are missing.'
          )
          return
        }
      }
      address = buildAddressString(fd, locale)
    }

    setLoading(true);
    try {
      const res = await fetch('/api/offering-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id: item?.id,
          item_title: a?.title ?? item?.title,
          method,
          name,
          email,
          address,
          note: note || undefined,
          locale,     // important: you renamed to "localization"
        }),
      });
  
      const raw = await res.text();
      let data: any = null;
      try { data = raw ? JSON.parse(raw) : null; } catch {}
  
      if (!res.ok || !data?.ok) {
        const msg =
          data?.error ||
          `${res.status} ${res.statusText} — ${raw?.slice(0, 200) || 'no body'}`;
        throw new Error(msg);
      }
  
      setDone({});
    } catch (err: any) {
      setError(err?.message || (locale === 'ja' ? '送信に失敗しました。' : 'Submission failed.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='w-full max-w-lg rounded-xl bg-white p-5'>
        <div className='flex items-start justify-between gap-4'>
          <h4 className='text-lg font-semibold'>
            {locale === 'ja' ? '結縁品の申込' : 'Offering request'}
          </h4>
          <button className='text-sm' onClick={onClose} aria-label='Close'>
            ×
          </button>
        </div>

        {(a?.title || item?.title) && (
          <p className='mt-2 text-sm text-gray-600'>
            <span className='font-medium'>
              {locale === 'ja' ? '品名' : 'Item'}:
            </span>{' '}
            {a?.title ?? item?.title}
          </p>
        )}

        {!done ? (
          <form onSubmit={submit} className='mt-4 space-y-3'>
            {bothAvailable && (
              <div className='flex gap-3 text-sm'>
                <label className='inline-flex items-center gap-1'>
                  <input
                    type='radio'
                    name='_method'
                    value='in_person'
                    checked={method === 'in_person'}
                    onChange={() => setMethod('in_person')}
                  />
                  {locale === 'ja' ? '現地受取' : 'Pick up at temple'}
                </label>
                <label className='inline-flex items-center gap-1'>
                  <input
                    type='radio'
                    name='_method'
                    value='mail'
                    checked={method === 'mail'}
                    onChange={() => setMethod('mail')}
                  />
                  {locale === 'ja'
                    ? '郵送（送料実費）'
                    : 'Mail (postage at cost)'}
                </label>
              </div>
            )}

            <input
              className='w-full rounded border px-3 py-2 text-sm'
              name='name'
              placeholder={locale === 'ja' ? 'お名前' : 'Name'}
              required
            />
            <input
              className='w-full rounded border px-3 py-2 text-sm'
              name='email'
              placeholder='Email'
              type='email'
              required
              inputMode='email'
              autoComplete='email'
            />

            {method === 'mail' && (
              <div className='grid grid-cols-1 gap-2'>
                <input
                  className='rounded border px-3 py-2 text-sm'
                  name='country'
                  placeholder={locale === 'ja' ? '国・地域' : 'Country/Region'}
                  required
                />
                <input
                  className='rounded border px-3 py-2 text-sm'
                  name='postal_code'
                  placeholder={locale === 'ja' ? '郵便番号' : 'Postal code'}
                  required
                />
                <input
                  className='rounded border px-3 py-2 text-sm'
                  name='state_or_pref'
                  placeholder={
                    locale === 'ja' ? '都道府県' : 'State/Prefecture'
                  }
                />
                <input
                  className='rounded border px-3 py-2 text-sm'
                  name='city'
                  placeholder={locale === 'ja' ? '市区町村' : 'City'}
                  required
                />
                <input
                  className='rounded border px-3 py-2 text-sm'
                  name='address1'
                  placeholder={
                    locale === 'ja' ? '住所1（番地まで）' : 'Address line 1'
                  }
                  required
                />
                <input
                  className='rounded border px-3 py-2 text-sm'
                  name='address2'
                  placeholder={
                    locale === 'ja' ? '住所2（建物名など）' : 'Address line 2'
                  }
                />
                <textarea
                  className='rounded border px-3 py-2 text-sm'
                  name='notes'
                  placeholder={
                    locale === 'ja' ? '備考（任意）' : 'Notes (optional)'
                  }
                />
              </div>
            )}

            {error && (
              <div
                role='alert'
                className='rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700'
              >
                {error}
              </div>
            )}

            <button
              disabled={loading}
              className='w-full rounded-lg border px-4 py-2 text-sm'
            >
              {loading
                ? locale === 'ja'
                  ? '送信中…'
                  : 'Submitting…'
                : locale === 'ja'
                  ? '送信'
                  : 'Submit'}
            </button>
          </form>
        ) : (
          <div className='mt-4 space-y-3 text-sm'>
            {done.code ? (
              <>
                <p>
                  {locale === 'ja'
                    ? '引換コードが発行されました。現地受付でご提示ください。'
                    : 'Your redeem code has been issued. Show it at the reception.'}
                </p>
                <div className='rounded border p-3 font-mono text-center text-lg'>
                  {done.code}
                </div>
              </>
            ) : (
              <p>
                {locale === 'ja'
                  ? 'お申込みを受け付けました。確認メールをお送りします。'
                  : 'Your request has been received. We will email a confirmation.'}
              </p>
            )}
            <div className='pt-1'>
              <button
                onClick={onClose}
                className='rounded-lg border px-3 py-1.5'
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
