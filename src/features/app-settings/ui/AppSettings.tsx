import { useQuery, useQueryClient } from '@tanstack/react-query'

import { usePrefsStore } from '#/entities/preference'
import { api } from '#/shared/api'

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
  { code: 'tj', label: 'TJ' },
]

const selectClass =
  'rounded border border-brand-200 bg-white px-1.5 py-1 text-xs text-ink/70 focus:outline-none'

export function AppSettings() {
  const qc = useQueryClient()
  const { locale, currency, setLocale, setCurrency } = usePrefsStore()

  // Currency options come from the backend; the persisted choice is always shown.
  const currencies = useQuery({
    queryKey: ['currencies'],
    queryFn: async () => {
      // /currencies declares no error responses -> use the data guard (lint rule).
      const { data } = await api.GET('/api/v1/currencies', {})
      return data ?? []
    },
  })

  const codes = currencies.data?.map((c) => c.code) ?? []
  const options = codes.includes(currency) ? codes : [currency, ...codes]

  // Refetch all content so localized text / converted prices update.
  const refresh = () => void qc.invalidateQueries()

  return (
    <div className="flex items-center gap-1">
      <select
        aria-label="Язык"
        className={selectClass}
        value={locale}
        onChange={(e) => {
          setLocale(e.target.value)
          refresh()
        }}
      >
        {LOCALES.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
      <select
        aria-label="Валюта"
        className={selectClass}
        value={currency}
        onChange={(e) => {
          setCurrency(e.target.value)
          refresh()
        }}
      >
        {options.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  )
}
