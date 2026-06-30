import { useState } from 'react'
import { Mail, MapPin, Phone, RefreshCw } from 'lucide-react'

import { useSubmitContact } from '#/features/contact'
import { Button, Field, Textarea } from '#/shared/ui'

// Office location (from the shared Yandex pin) — used for the OSM map marker.
const LAT = 38.562709
const LNG = 68.814221
const MAP_SRC =
  'https://www.openstreetmap.org/export/embed.html?bbox=68.8092%2C38.5607%2C68.8192%2C38.5647' +
  `&layer=mapnik&marker=${LAT}%2C${LNG}`

const INFO = [
  { icon: Phone, label: 'Контактные номера', value: '+992 99 555 00 32' },
  { icon: Mail, label: 'Эл. почта', value: 'ai.academy@zypl.ai' },
  { icon: MapPin, label: 'Адрес', value: '21 Sh. Shotemur Street, Dushanbe' },
]

function randomCaptcha() {
  return Math.random().toString(36).slice(2, 7).toUpperCase()
}

export function ContactPage() {
  const submit = useSubmitContact()
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [captcha, setCaptcha] = useState(randomCaptcha)
  const [captchaInput, setCaptchaInput] = useState('')
  const [captchaError, setCaptchaError] = useState(false)

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (captchaInput.trim().toUpperCase() !== captcha) {
      setCaptchaError(true)
      return
    }
    setCaptchaError(false)
    submit.mutate(form, {
      onSuccess: () => {
        setForm({ name: '', email: '', phone: '', subject: '', message: '' })
        setCaptchaInput('')
        setCaptcha(randomCaptcha())
      },
    })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="grid items-stretch gap-6 rounded-[32px] border border-brand-100 bg-white p-4 shadow-sm lg:grid-cols-[300px_1fr_minmax(360px,1fr)] lg:p-6">
        {/* Left — contact info */}
        <aside className="space-y-8 rounded-3xl bg-brand-600 p-8 text-white">
          {INFO.map((i) => (
            <div key={i.label} className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-white/15">
                  <i.icon className="size-5" strokeWidth={1.8} />
                </span>
                <span className="font-display font-bold">{i.label}</span>
              </div>
              <p className="pl-12 text-sm text-white/85">{i.value}</p>
            </div>
          ))}
        </aside>

        {/* Center — form */}
        <div className="px-2 py-2 lg:px-6">
          <p className="font-display font-bold text-ink">Есть вопрос? 👋</p>
          <h1 className="mt-1 font-display text-3xl font-bold text-ink">
            Связаться с нашей командой
          </h1>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <Field label="Ваше имя" value={form.name} onChange={set('name')} required />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Эл. почта"
                type="email"
                value={form.email}
                onChange={set('email')}
                required
              />
              <Field label="Телефон" value={form.phone} onChange={set('phone')} />
            </div>
            <Field label="Тема" value={form.subject} onChange={set('subject')} required />
            <Textarea
              label="Сообщение"
              rows={6}
              value={form.message}
              onChange={set('message')}
              required
            />

            <div className="grid items-end gap-4 sm:grid-cols-2">
              <Field
                label="Captcha"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                required
              />
              <div className="flex items-center gap-3">
                <span className="select-none rounded-lg border border-brand-200 bg-brand-50 px-5 py-2 font-display text-xl italic tracking-[0.3em] text-ink line-through decoration-brand-400">
                  {captcha}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setCaptcha(randomCaptcha())
                    setCaptchaInput('')
                  }}
                  className="rounded-lg p-2 text-ink/50 transition hover:bg-brand-50 hover:text-brand-600"
                  aria-label="Обновить captcha"
                >
                  <RefreshCw className="size-5" />
                </button>
              </div>
            </div>
            {captchaError && <p className="text-sm text-red-600">Неверная captcha</p>}
            {submit.isError && <p className="text-sm text-red-600">{submit.error.message}</p>}
            {submit.isSuccess && (
              <p className="text-sm text-green-600">Сообщение отправлено — спасибо!</p>
            )}

            <Button type="submit" disabled={submit.isPending} className="w-full py-3">
              {submit.isPending ? 'Отправка…' : 'Отправить сообщение'}
            </Button>
          </form>
        </div>

        {/* Right — map */}
        <div className="min-h-[420px] overflow-hidden rounded-3xl border border-brand-100">
          <iframe
            title="AI Academy на карте"
            src={MAP_SRC}
            className="size-full"
            style={{ minHeight: 420, border: 0 }}
            loading="lazy"
          />
        </div>
      </div>
    </div>
  )
}
