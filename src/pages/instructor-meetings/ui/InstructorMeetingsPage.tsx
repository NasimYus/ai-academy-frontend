import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { meetingConfigQueryOptions, meetingsIndexQueryOptions } from '#/entities/meeting'
import { MeetingConfigForm, useFinishReservation } from '#/features/manage-meeting'

const STATUS_RU: Record<string, string> = {
  pending: 'Ожидает',
  open: 'Открыта',
  finished: 'Завершена',
  canceled: 'Отменена',
}

export function InstructorMeetingsPage() {
  const config = useQuery(meetingConfigQueryOptions)
  const index = useQuery(meetingsIndexQueryOptions)
  const finish = useFinishReservation()

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Консультации</h1>
        <Link to="/instructor" className="text-sm text-brand-600 hover:underline">
          ← К курсам
        </Link>
      </div>

      {config.isPending ? (
        <p className="text-ink/60">Загрузка…</p>
      ) : config.isError ? (
        <p className="text-red-600">{config.error.message}</p>
      ) : (
        <MeetingConfigForm config={config.data} />
      )}

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-ink/70">Заявки студентов</h2>
        {index.data && index.data.requests.meetings.length > 0 ? (
          <ul className="space-y-2">
            {index.data.requests.meetings.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between rounded-lg border border-brand-100 bg-white px-4 py-2 text-sm"
              >
                <span className="text-ink">
                  {r.instructor?.full_name ?? 'Студент'} ·{' '}
                  {r.time ? `${r.time.start}–${r.time.end}` : '—'}
                </span>
                <span className="flex items-center gap-3">
                  <span className="text-ink/50">{STATUS_RU[r.status] ?? r.status}</span>
                  {r.status !== 'finished' && (
                    <button
                      type="button"
                      onClick={() => finish.mutate(r.id)}
                      disabled={finish.isPending}
                      className="text-brand-600 hover:underline disabled:opacity-50"
                    >
                      Завершить
                    </button>
                  )}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-ink/60">Заявок пока нет.</p>
        )}
      </section>
    </div>
  )
}
