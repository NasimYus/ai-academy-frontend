import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { meetingsIndexQueryOptions } from '#/entities/meeting'
import { usePayReservation } from '#/features/reserve-meeting'

const STATUS_RU: Record<string, string> = {
  pending: 'Ожидает',
  open: 'Открыта',
  finished: 'Завершена',
  canceled: 'Отменена',
}

export function MyMeetingsPage() {
  const navigate = useNavigate()
  const pay = usePayReservation()
  const { data, isPending, isError, error } = useQuery(meetingsIndexQueryOptions)

  if (isPending) return <p className="mx-auto max-w-3xl px-6 py-8 text-ink/60">Загрузка…</p>
  if (isError) return <p className="mx-auto max-w-3xl px-6 py-8 text-red-600">{error.message}</p>

  const list = data.reservations.meetings

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-ink">Мои консультации</h1>

      {list.length === 0 ? (
        <p className="text-ink/60">У вас пока нет записей.</p>
      ) : (
        <ul className="space-y-2">
          {list.map((r) => (
            <li
              key={r.id}
              className="rounded-xl border border-brand-100 bg-white px-4 py-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-ink">
                  {r.instructor?.full_name ?? 'Преподаватель'}
                </span>
                <span className="text-xs text-ink/50">{STATUS_RU[r.status] ?? r.status}</span>
              </div>
              <p className="mt-1 text-sm text-ink/60">
                {r.day ? `${r.day} · ` : ''}
                {r.time ? `${r.time.start}–${r.time.end}` : ''}
                {r.amount > 0 ? ` · ${r.amount}` : ''}
              </p>
              {r.description && (
                <p className="mt-1 text-sm text-ink/70">{r.description}</p>
              )}
              {r.status === 'pending' && r.amount > 0 && (
                <button
                  type="button"
                  onClick={() =>
                    pay.mutate(r.id, { onSuccess: () => void navigate({ to: '/orders' }) })
                  }
                  disabled={pay.isPending}
                  className="mt-2 rounded-lg bg-brand-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
                >
                  {pay.isPending ? '…' : `Оплатить ${r.amount}`}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
