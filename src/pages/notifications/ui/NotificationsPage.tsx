import { useState } from 'react'

import { useMarkSeen, useNotifications } from '#/features/notifications'

type Filter = 'all' | 'unread' | 'read'

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'unread', label: 'Непрочитанные' },
  { key: 'read', label: 'Прочитанные' },
]

export function NotificationsPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const { data, isPending, isError, error } = useNotifications()
  const markSeen = useMarkSeen()

  if (isPending) return <p className="mx-auto max-w-3xl px-6 py-8 text-ink/60">Загрузка…</p>
  if (isError)
    return <p className="mx-auto max-w-3xl px-6 py-8 text-red-600">{error.message}</p>

  const items = data.notifications.filter((n) =>
    filter === 'all' ? true : n.status === filter,
  )

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-ink">Уведомления</h1>

      <div className="mb-5 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setFilter(f.key)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              filter === f.key
                ? 'bg-brand-600 text-white'
                : 'border border-brand-200 text-brand-700 hover:bg-brand-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <p className="text-ink/60">Здесь пока ничего нет.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((n) => (
            <li
              key={n.id}
              className={`rounded-xl border p-4 ${
                n.status === 'unread'
                  ? 'border-brand-200 bg-brand-50/50'
                  : 'border-brand-100 bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-ink">{n.title}</p>
                  <p className="mt-1 text-sm text-ink/70">{n.message}</p>
                  <p className="mt-2 text-xs text-ink/40">
                    {new Date(n.created_at).toLocaleString('ru-RU')}
                  </p>
                </div>
                {n.status === 'unread' && (
                  <button
                    type="button"
                    onClick={() => markSeen.mutate(n.id)}
                    disabled={markSeen.isPending}
                    className="shrink-0 rounded-lg border border-brand-200 px-3 py-1 text-xs font-medium text-brand-700 transition hover:bg-brand-50 disabled:opacity-50"
                  >
                    Прочитано
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
