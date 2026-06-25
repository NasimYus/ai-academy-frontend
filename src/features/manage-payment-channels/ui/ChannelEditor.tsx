import { useState } from 'react'

import type { AdminPaymentChannel } from '#/features/manage-payment-channels/api/admin-channels'
import {
  useToggleChannel,
  useUpdateChannel,
} from '#/features/manage-payment-channels/model/use-channels'

/** Edit one gateway: title/image, test-mode, per-driver credentials, currencies. */
export function ChannelEditor({ channel }: { channel: AdminPaymentChannel }) {
  const update = useUpdateChannel()
  const toggle = useToggleChannel()

  const [title, setTitle] = useState(channel.title)
  const [image, setImage] = useState(channel.image ?? '')
  const [testMode, setTestMode] = useState(channel.test_mode)
  const [creds, setCreds] = useState<Record<string, string>>(
    Object.fromEntries(
      channel.credential_items.map((k) => [k, String(channel.credentials?.[k] ?? '')]),
    ),
  )
  const [currencies, setCurrencies] = useState((channel.currencies ?? []).join(', '))

  const save = () => {
    const credentials = Object.fromEntries(
      Object.entries(creds).filter(([, v]) => v.trim() !== ''),
    )
    const currencyList = currencies
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean)
    update.mutate({
      id: channel.id,
      body: {
        title,
        image: image.trim() || null,
        test_mode: testMode,
        credentials: Object.keys(credentials).length ? credentials : null,
        currencies: currencyList.length ? currencyList : null,
      },
    })
  }

  const isActive = channel.status === 'active'

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        save()
      }}
      className="space-y-3 rounded-xl border border-brand-100 bg-white p-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-ink">
          {channel.class_name}
          {!channel.supported && (
            <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700">
              нет драйвера
            </span>
          )}
        </h3>
        <button
          type="button"
          onClick={() => toggle.mutate(channel.id)}
          disabled={toggle.isPending}
          className={`rounded-full px-3 py-1 text-xs font-medium transition disabled:opacity-50 ${
            isActive ? 'bg-green-100 text-green-700' : 'bg-ink/10 text-ink/50'
          }`}
        >
          {isActive ? 'Активен' : 'Выключен'}
        </button>
      </div>

      <label className="block text-sm text-ink/70">
        Название
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm"
        />
      </label>

      <label className="block text-sm text-ink/70">
        Логотип (URL)
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="/media/…"
          className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm"
        />
      </label>

      {channel.credential_items.map((key) => (
        <label key={key} className="block text-sm text-ink/70">
          {key}
          <input
            value={creds[key] ?? ''}
            onChange={(e) => setCreds((prev) => ({ ...prev, [key]: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 font-mono text-sm"
          />
        </label>
      ))}

      <label className="block text-sm text-ink/70">
        Валюты (через запятую)
        <input
          value={currencies}
          onChange={(e) => setCurrencies(e.target.value)}
          placeholder="TJS, USD"
          className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm"
        />
      </label>

      {channel.show_test_mode_toggle && (
        <label className="flex items-center gap-2 text-sm text-ink/70">
          <input
            type="checkbox"
            checked={testMode}
            onChange={(e) => setTestMode(e.target.checked)}
          />
          Тестовый режим
        </label>
      )}

      {update.isError && <p className="text-sm text-red-600">{update.error.message}</p>}
      <button
        type="submit"
        disabled={update.isPending}
        className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
      >
        {update.isPending ? 'Сохранение…' : 'Сохранить'}
      </button>
    </form>
  )
}
