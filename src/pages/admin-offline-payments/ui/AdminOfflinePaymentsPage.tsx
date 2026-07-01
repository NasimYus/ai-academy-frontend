import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Check, X } from 'lucide-react'

import {
  adminOfflinePaymentsQueryOptions,
  useOfflinePaymentActions,
} from '#/features/manage-offline-payments'
import type { OfflinePaymentStatus } from '#/features/manage-offline-payments'
import { Avatar, Badge, Button, EmptyState, PageHeader, Spinner } from '#/shared/ui'

const TABS: { value: OfflinePaymentStatus | ''; label: string }[] = [
  { value: 'waiting', label: 'В ожидании' },
  { value: 'approved', label: 'Одобренные' },
  { value: 'reject', label: 'Отклонённые' },
  { value: '', label: 'Все' },
]

const STATUS: Record<string, { label: string; tone: 'success' | 'warning' | 'danger' }> = {
  approved: { label: 'Одобрено', tone: 'success' },
  waiting: { label: 'В ожидании', tone: 'warning' },
  reject: { label: 'Отклонено', tone: 'danger' },
}

const fmt = (iso: string) => new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium' }).format(new Date(iso))

export function AdminOfflinePaymentsPage() {
  const [tab, setTab] = useState<OfflinePaymentStatus | ''>('waiting')
  const { data, isPending, isError, error } = useQuery(
    adminOfflinePaymentsQueryOptions(tab || undefined),
  )
  const actions = useOfflinePaymentActions()

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <PageHeader title="Офлайн-платежи" subtitle="Подтверждайте пополнения счёта — баланс зачисляется при одобрении." />

      <div className="mb-5 flex flex-wrap gap-1 rounded-xl bg-brand-50 p-1">
        {TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setTab(t.value)}
            className={`rounded-lg px-4 py-1.5 text-sm font-medium transition ${
              tab === t.value ? 'bg-brand-600 text-white shadow-sm' : 'text-ink/60 hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isPending && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}
      {isError && <p className="text-red-600">{error.message}</p>}

      {data && data.length === 0 && (
        <EmptyState icon="💳">
          <p className="font-semibold text-ink">Платежей нет</p>
        </EmptyState>
      )}

      <div className="space-y-2">
        {data?.map((p) => {
          const s = STATUS[p.status] ?? STATUS.waiting
          const busy = actions.approve.isPending || actions.reject.isPending
          return (
            <div key={p.id} className="flex items-center justify-between gap-3 rounded-2xl border border-brand-100 p-4">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar name={p.user_name ?? p.user_email ?? '?'} size={40} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink">{p.user_name ?? p.user_email ?? '—'}</p>
                  <p className="truncate text-xs text-ink/50">
                    {p.bank ?? '—'}
                    {p.reference_number ? ` · ${p.reference_number}` : ''} · {fmt(p.created_at)}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="font-display text-lg font-bold text-ink">
                  {p.amount.toLocaleString('ru-RU')}C
                </span>
                {p.status === 'waiting' ? (
                  <div className="flex items-center gap-2">
                    <Button size="sm" disabled={busy} onClick={() => actions.approve.mutate(p.id)} className="gap-1">
                      <Check className="size-4" /> Одобрить
                    </Button>
                    <Button size="sm" variant="ghost" disabled={busy} onClick={() => actions.reject.mutate(p.id)} className="gap-1 text-red-600">
                      <X className="size-4" /> Отклонить
                    </Button>
                  </div>
                ) : (
                  <Badge tone={s.tone}>{s.label}</Badge>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
