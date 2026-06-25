import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { instructorMeetingQueryOptions } from '#/entities/meeting'
import { useSessionStore } from '#/entities/session'

import { useReserveMeeting } from '#/features/reserve-meeting/model/use-reserve'

const DAY_RU: Record<string, string> = {
  monday: 'Пн',
  tuesday: 'Вт',
  wednesday: 'Ср',
  thursday: 'Чт',
  friday: 'Пт',
  saturday: 'Сб',
  sunday: 'Вс',
}

/** Booking panel for an instructor's consultation slots (on their public profile). */
export function ReserveMeetingPanel({ instructorId }: { instructorId: number }) {
  const token = useSessionStore((s) => s.token)
  const { data } = useQuery(instructorMeetingQueryOptions(instructorId))
  const reserve = useReserveMeeting()
  const [done, setDone] = useState(false)

  if (!data || data.times.length === 0) return null

  return (
    <section className="mt-6 rounded-xl border border-brand-100 bg-white p-4">
      <h2 className="mb-1 text-lg font-semibold text-ink">Консультации</h2>
      <p className="mb-3 text-sm text-ink/60">
        {data.amount && data.amount > 0 ? `${data.amount} за сессию` : 'Бесплатно'}
      </p>

      {done ? (
        <p className="text-sm text-green-600">Заявка отправлена.</p>
      ) : (
        <ul className="space-y-2">
          {data.times.map((t) => (
            <li key={t.id} className="flex items-center justify-between text-sm">
              <span className="text-ink">
                {DAY_RU[t.day_label] ?? t.day_label} · {t.time}
              </span>
              <button
                type="button"
                disabled={!token || reserve.isPending}
                onClick={() => reserve.mutate({ meetingTimeId: t.id }, { onSuccess: () => setDone(true) })}
                className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
              >
                {token ? 'Записаться' : 'Войдите'}
              </button>
            </li>
          ))}
        </ul>
      )}
      {reserve.isError && <p className="mt-2 text-sm text-red-600">{reserve.error.message}</p>}
    </section>
  )
}
