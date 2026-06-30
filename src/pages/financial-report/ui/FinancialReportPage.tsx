import { useQuery } from '@tanstack/react-query'
import { Receipt } from 'lucide-react'
import { useMemo, useState } from 'react'

import { accountingQueryOptions } from '#/entities/financial'
import { PageHeader, Select, Spinner } from '#/shared/ui'
import { PanelLayout } from '#/widgets/panel-layout'

const fmt = (iso: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))

export function FinancialReportPage() {
  const { data, isPending, isError, error } = useQuery(accountingQueryOptions)
  const [type, setType] = useState('')
  const [search, setSearch] = useState('')

  const rows = useMemo(() => {
    const all = data ?? []
    return all.filter(
      (r) =>
        (!type || r.type === type) &&
        (!search || (r.description ?? '').toLowerCase().includes(search.toLowerCase())),
    )
  }, [data, type, search])

  return (
    <PanelLayout>
      <PageHeader title="Финансовый отчёт" />
      <div className="rounded-3xl bg-white p-5">
        <h3 className="font-display font-bold text-ink">Финансовые документы</h3>
        <p className="mt-1 text-sm text-ink/50">
          Просматривайте и управляйте транзакциями вашего аккаунта.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по описанию…"
            className="rounded-xl border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-300"
          />
          <Select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Все типы</option>
            <option value="addiction">Пополнение</option>
            <option value="deduction">Списание</option>
          </Select>
        </div>

        {isPending ? (
          <Spinner />
        ) : isError ? (
          <p className="mt-4 text-red-600">{error.message}</p>
        ) : rows.length === 0 ? (
          <div className="mt-5 flex flex-col items-center rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 p-12 text-center">
            <span className="flex size-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
              <Receipt className="size-6" />
            </span>
            <h5 className="mt-3 text-sm font-semibold text-ink">Документов нет!</h5>
            <p className="mt-1 text-xs text-ink/50">По вашему аккаунту пока нет транзакций.</p>
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-brand-50 text-left text-xs font-bold uppercase tracking-wide text-ink/40">
                  <th className="pb-3">Описание</th>
                  <th className="pb-3 text-right">Сумма (C)</th>
                  <th className="pb-3 text-right">Дата</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const credit = r.type === 'addiction'
                  return (
                    <tr key={r.id} className="border-b border-brand-50/60">
                      <td className="py-3 text-ink/80">{r.description ?? '—'}</td>
                      <td
                        className={`py-3 text-right font-bold ${credit ? 'text-green-600' : 'text-red-600'}`}
                      >
                        {credit ? '+' : '−'}
                        {r.amount.toLocaleString('ru-RU')}
                      </td>
                      <td className="py-3 text-right text-ink/50">{fmt(r.created_at)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PanelLayout>
  )
}
