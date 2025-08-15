/** @format */

// app/components/ContactPageClient.tsx
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ContactDict, Locale } from '@/i18n/get-dictionary'

type Step = 1 | 2 | 3

type Options = {
  cats: string[]
  desired: string[]
  age: string[]
  gender: string[]
  enquete_cat: string[]
  reason: string[]
  evaluation1: string[]
  evaluation2: string[]
}

const RequiredBadge = ({ text }: { text: string }) => (
  <span className='ml-2 text-[17px] font-bold text-[#c25407]'>
    {text}
  </span>
)

const LabelRow = ({
  label,
  required,
  boxed = false,
  forId,
  children,
  text
}: {
  label: string
  required?: boolean
  boxed?: boolean
  forId?: string
  children: React.ReactNode
  text?: string
}) => (
  <div className='mb-6'>
    <div className='flex items-center justify-between'>
      <label
        htmlFor={forId}
        className='block text-[19px] font-bold text-[#3c3c3c] pb-2'
      >
        {label}
      </label>
      {required && <RequiredBadge text={text ?? ''} />}
    </div>
    <div
      className={
        boxed
          ? 'mt-2 rounded-md border border-[#d8d0c6] bg-white/50 px-4 py-4'
          : 'mt-2'
      }
    >
      {children}
    </div>
  </div>
)

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full bg-[#f5f1e9] border border-[#e7e0d6] rounded-md px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#c9a87a]/40 ${props.className || ''}`}
  />
)

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    className={`w-full bg-[#f5f1e9] border border-[#e7e0d6] rounded-md px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#c9a87a]/40 ${props.className || ''}`}
  />
)

const FieldCard = ({ children }: { children: React.ReactNode }) => (
  <div className='rounded-md border border-[#e7e0d6] bg-[#fbf7ef] px-5 py-5'>
    {children}
  </div>
)

const RadioStack = ({
  name,
  value,
  options,
  required,
  onChange,
}: {
  name: string
  value: string
  options: string[]
  required?: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => (
  <div className='space-y-2'>
    {options.map((opt) => (
      <label key={opt} className='flex items-center gap-3'>
        <input
          type='radio'
          name={name}
          value={opt}
          checked={value === opt}
          onChange={onChange}
          required={required}
          className='h-4 w-4'
        />
        <span className='text-[17px]'>{opt}</span>
      </label>
    ))}
  </div>
)

const CheckboxStack = ({
  name,
  values,
  options,
  onChange,
}: {
  name: 'reason'
  values: string[]
  options: string[]
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) => (
  <div className='space-y-2'>
    {options.map((opt) => (
      <label key={opt} className='flex items-center gap-3'>
        <input
          type='checkbox'
          name={name}
          value={opt}
          checked={values.includes(opt)}
          onChange={onChange}
          className='h-4 w-4'
        />
        <span className='text-[17px]'>{opt}</span>
      </label>
    ))}
  </div>
)

const Stepper = ({ step, dict }: { step: Step, dict: ContactDict }) => {
  const items = [
    { i: 1 as Step, label: dict.stepper.enter },
    { i: 2 as Step, label: dict.stepper.review },
    { i: 3 as Step, label: dict.stepper.done },
  ]
  const ACCENT = '#c25407'
  const LINE = '#d8d0c6'
  const INK = '#1f1f1f'
  return (
    <div className='relative mx-auto my-12 max-w-4xl px-6 pointer-events-none'>
      <div
        className='absolute left-14 right-14 top-[17px] h-[1px]'
        style={{ backgroundColor: LINE }}
      />
      <div className='relative z-10 flex items-start justify-between'>
        {items.map(({ i, label }) => {
          const active = step === i
          return (
            <div key={i} className='flex flex-col items-center'>
              <div className='relative h-8 w-8'>
                {active && (
                  <span
                    className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full'
                    style={{ backgroundColor: `${ACCENT}22` }}
                  />
                )}
                <span
                  className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 block h-3.5 w-3.5 rounded-full'
                  style={{ backgroundColor: active ? ACCENT : INK }}
                />
              </div>
              <span
                className='mt-4 text-base font-extrabold tracking-wide'
                style={{ color: active ? ACCENT : INK }}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function ContactPageClient({
  dict,
  options,
  lang,
}: {
  dict: ContactDict
  options: Options
  lang: Locale
}) {
  const [step, setStep] = useState<Step>(1)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const guard = (ev: Event) => {
      const t = ev.target as Element | null
      if (!t) return

      // Never interfere with real form interactions
      if (
        t.closest(
          'input, textarea, select, button, label, [contenteditable="true"]'
        )
      )
        return

      const a = t.closest('a') as HTMLAnchorElement | null
      if (!a) return

      const href = (a.getAttribute('href') || '').trim()
      if (href === '#' || href === '') {
        ev.preventDefault()
      }
    }

    document.addEventListener('click', guard, {
      capture: true,
      passive: false,
    })
    return () => document.removeEventListener('click', guard, true)
  }, [])

  const [form, setForm] = useState({
    cat: options.cats[0] ?? '',
    desired: options.desired[0] ?? '',
    name: '',
    tel: '',
    email: '',
    email2: '',
    comment: '',
    age: '',
    gender: '',
    enquete_cat: '',
    reason: [] as string[],
    evaluation1: '',
    evaluation_cmt1: '',
    evaluation2: '',
    evaluation_cmt2: '',
    enquete_cmt: '',
    website: '',
  })

  function onChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value, type, checked } = e.target as any
    if (type === 'checkbox') {
      setForm((p) => {
        const s = new Set(p.reason)
        checked ? s.add(value) : s.delete(value)
        return { ...p, reason: Array.from(s) }
      })
    } else {
      setForm((p) => ({ ...p, [name]: value }))
    }
  }

  function gotoConfirm() {
    if (
      !form.cat ||
      !form.desired ||
      !form.name.trim() ||
      !form.email ||
      !form.email2 ||
      !form.comment.trim()
    ) {
      alert(dict.labels.reviewNote)
      return
    }
    if (form.email !== form.email2) {
      alert(
        lang === 'ja' ? 'メールアドレスが一致しません' : 'Emails do not match'
      )
      return
    }
    setStep(2)
  }
  async function onSubmitFinal() {
    if (form.website) return
    setStep(3)
  }

  const summary = useMemo(
    () => [
      { label: dict.labels.name, value: form.name },
      { label: dict.labels.email, value: form.email },
      { label: dict.labels.tel, value: form.tel },
      { label: dict.labels.comment, value: form.comment },
      { label: dict.labels.cat, value: form.cat },
      { label: dict.labels.desired, value: form.desired },
      {
        label: dict.labels.age,
        value: form.age || (lang === 'ja' ? '（未回答）' : '(no answer)'),
      },
      {
        label: dict.labels.gender,
        value: form.gender || (lang === 'ja' ? '（未回答）' : '(no answer)'),
      },
      {
        label: dict.labels.enquete_cat,
        value:
          form.enquete_cat || (lang === 'ja' ? '（未回答）' : '(no answer)'),
      },
      {
        label: dict.labels.reason,
        value: form.reason.length
          ? form.reason.join(lang === 'ja' ? '、' : ', ')
          : lang === 'ja'
            ? '（未回答）'
            : '(no answer)',
      },
      {
        label: dict.labels.evaluation1,
        value:
          form.evaluation1 || (lang === 'ja' ? '（未回答）' : '(no answer)'),
      },
      {
        label: `${dict.labels.evaluation1} ${lang === 'ja' ? 'コメント' : 'comment'}`,
        value:
          form.evaluation_cmt1 ||
          (lang === 'ja' ? '（未回答）' : '(no answer)'),
      },
      {
        label: dict.labels.evaluation2,
        value:
          form.evaluation2 || (lang === 'ja' ? '（未回答）' : '(no answer)'),
      },
      {
        label: `${dict.labels.evaluation2} ${lang === 'ja' ? 'コメント' : 'comment'}`,
        value:
          form.evaluation_cmt2 ||
          (lang === 'ja' ? '（未回答）' : '(no answer)'),
      },
      {
        label: dict.labels.enquete_cmt,
        value:
          form.enquete_cmt || (lang === 'ja' ? '（未回答）' : '(no answer)'),
      },
    ],
    [form, dict, lang]
  )

  return (
    <main
      ref={rootRef}
      data-contact
      className='relative isolate min-h-screen text-[#1f1f1f] z-[1]'
    >
      <section
        className='relative z-[9999] pointer-events-auto max-w-5xl mx-auto px-5 sm:px-8 pb-16'
      >
        <Stepper step={step} dict={dict} />

        {step === 1 && (
          <>
            <div className='mb-10 space-y-1'>
              {dict.blurb.map((p) => (
                <p key={p} className='text-[19px] leading-relaxed'>
                  {p}
                </p>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
              }}
              className='space-y-10'
            >
              <FieldCard>
                <LabelRow label={dict.labels.cat} required boxed text={dict.labels.required}>
                  <RadioStack
                    name='cat'
                    value={form.cat}
                    options={options.cats}
                    required
                    onChange={onChange}
                  />
                </LabelRow>
                <LabelRow label={dict.labels.desired} required boxed text={dict.labels.required}>
                  <RadioStack
                    name='desired'
                    value={form.desired}
                    options={options.desired}
                    required
                    onChange={onChange}
                  />
                </LabelRow>
                <LabelRow label={dict.labels.name} required forId='name' text={dict.labels.required}>
                  <Input
                    id='name'
                    name='name'
                    value={form.name}
                    onChange={onChange}
                  />
                </LabelRow>
                <LabelRow label={dict.labels.email} required forId='email' text={dict.labels.required}>
                  <Input
                    id='email'
                    name='email'
                    type='email'
                    value={form.email}
                    onChange={onChange}
                  />
                  <p className='mt-2 text-sm text-[#6b6b6b]'>
                    {dict.labels.reviewNote}
                  </p>
                  <Input
                    id='email2'
                    name='email2'
                    type='email'
                    value={form.email2}
                    onChange={onChange}
                    className='mt-2'
                  />
                </LabelRow>
                <LabelRow label={dict.labels.comment} required forId='comment' text={dict.labels.required}>
                  <Textarea
                    id='comment'
                    name='comment'
                    rows={6}
                    value={form.comment}
                    onChange={onChange}
                  />
                </LabelRow>
              </FieldCard>

              <FieldCard>
                <LabelRow label={dict.labels.age} forId='age'>
                  <select
                    id='age'
                    name='age'
                    value={form.age}
                    onChange={onChange}
                    className='w-full bg-[#f5f1e9] border border-[#e7e0d6] rounded-md px-4 py-3 text-[15px] outline-none focus:ring-2 focus:ring-[#c9a87a]/40'
                  >
                    <option value=''>
                      {lang === 'ja' ? '選択してください' : 'Select'}
                    </option>
                    {options.age.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </LabelRow>

                <LabelRow label={dict.labels.gender} boxed>
                  <RadioStack
                    name='gender'
                    value={form.gender}
                    options={options.gender}
                    onChange={onChange}
                  />
                </LabelRow>

                <LabelRow label={dict.labels.enquete_cat} boxed>
                  <RadioStack
                    name='enquete_cat'
                    value={form.enquete_cat}
                    options={options.enquete_cat}
                    onChange={onChange}
                  />
                </LabelRow>

                <LabelRow label={dict.labels.reason} boxed>
                  <CheckboxStack
                    name='reason'
                    values={form.reason}
                    options={options.reason}
                    onChange={onChange}
                  />
                </LabelRow>

                <LabelRow label={dict.labels.evaluation1} boxed>
                  <RadioStack
                    name='evaluation1'
                    value={form.evaluation1}
                    options={options.evaluation1}
                    onChange={onChange}
                  />
                  <Textarea
                    name='evaluation_cmt1'
                    rows={4}
                    value={form.evaluation_cmt1}
                    onChange={onChange}
                    placeholder={
                      lang === 'ja' ? '理由（任意）' : 'Reason (optional)'
                    }
                    className='mt-3'
                  />
                </LabelRow>

                <LabelRow label={dict.labels.evaluation2} boxed>
                  <RadioStack
                    name='evaluation2'
                    value={form.evaluation2}
                    options={options.evaluation2}
                    onChange={onChange}
                  />
                  <Textarea
                    name='evaluation_cmt2'
                    rows={4}
                    value={form.evaluation_cmt2}
                    onChange={onChange}
                    placeholder={
                      lang === 'ja' ? '理由（任意）' : 'Reason (optional)'
                    }
                    className='mt-3'
                  />
                </LabelRow>

                <LabelRow label={dict.labels.enquete_cmt}>
                  <Textarea
                    name='enquete_cmt'
                    rows={6}
                    value={form.enquete_cmt}
                    onChange={onChange}
                  />
                </LabelRow>
              </FieldCard>

              <input
                type='text'
                name='website'
                value={form.website}
                onChange={onChange}
                className='hidden'
                tabIndex={-1}
              />
              <div className='flex justify-center gap-4'>
                <button
                  type='button'
                  onClick={gotoConfirm}
                  className='inline-flex items-center gap-2 rounded-full bg-[#c25407] text-white px-6 py-3 font-bold text-sm hover:opacity-90'
                >
                  {dict.labels.toReview}
                </button>
              </div>
            </form>
          </>
        )}

        {step === 2 && (
          <div className='mt-6'>
            <p className='text-sm text-[#4b4b4b] mb-6'>
              {dict.labels.reviewNote}
            </p>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4'>
              {summary.map((row) => (
                <div key={row.label} className='border-b border-[#d8d0c6] pb-3'>
                  <div className='text-[13px] font-semibold text-[#484848]'>
                    {row.label}
                  </div>
                  <div className='mt-2 text-[15px] whitespace-pre-wrap'>
                    {row.value || '—'}
                  </div>
                </div>
              ))}
            </div>
            <div className='mt-10 flex justify-center gap-3'>
              <button
                type='button'
                onClick={() => setStep(1)}
                className='inline-flex items-center gap-2 rounded-full border border-[#1f1f1f] text-[#1f1f1f] px-6 py-3 text-sm hover:bg-black/5'
              >
                {dict.labels.back}
              </button>
              <button
                type='button'
                onClick={onSubmitFinal}
                className='inline-flex items-center gap-2 rounded-full bg-[#1f1f1f] text-white px-6 py-3 text-sm hover:opacity-90'
              >
                {dict.labels.submit}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className='mt-12 text-center'>
            <h2 className='text-2xl font-bold mb-3'>{dict.labels.sentTitle}</h2>
            <p className='text-[15px] text-[#4b4b4b]'>{dict.labels.sentBody}</p>
          </div>
        )}
      </section>

      {/* belt-and-suspenders: disable empty/# anchors on this page */}
      <style jsx global>{`
        a[href='#'],
        a[href=''] {
          pointer-events: none !important;
        }
      `}</style>
    </main>
  )
}