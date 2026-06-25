import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import {
  adminCoursesQueryOptions,
  useApproveCourse,
  useRejectCourse,
  useUnpublishCourse,
} from '#/features/moderate-courses'

const STATUS_RU: Record<string, string> = {
  active: 'Опубликован',
  pending: 'На модерации',
  is_draft: 'Черновик',
  inactive: 'Отклонён',
}

const STATUS_CLASS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  is_draft: 'bg-ink/10 text-ink/50',
  inactive: 'bg-red-100 text-red-700',
}

export function AdminCoursesPage() {
  const { data, isPending, isError, error } = useQuery(adminCoursesQueryOptions)
  const approve = useApproveCourse()
  const reject = useRejectCourse()
  const unpublish = useUnpublishCourse()
  const busy = approve.isPending || reject.isPending || unpublish.isPending

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Модерация курсов</h1>
        <Link to="/admin/payment-channels" className="text-sm text-brand-600 hover:underline">
          Шлюзы →
        </Link>
      </div>

      {isPending ? (
        <p className="text-ink/60">Загрузка…</p>
      ) : isError ? (
        <p className="text-red-600">{error.message}</p>
      ) : (
        <>
          <p className="text-sm text-ink/60">
            Всего: {data.count} · на модерации: {data.pending_count}
          </p>
          <ul className="space-y-2">
            {data.courses.map((c) => (
              <li
                key={c.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-brand-100 bg-white px-4 py-3"
              >
                <div>
                  <span className="font-medium text-ink">{c.title}</span>
                  <span
                    className={`ml-2 rounded px-1.5 py-0.5 text-xs ${STATUS_CLASS[c.status] ?? ''}`}
                  >
                    {STATUS_RU[c.status] ?? c.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  {c.status !== 'active' && (
                    <button
                      type="button"
                      onClick={() => approve.mutate(c.id)}
                      disabled={busy}
                      className="text-green-700 hover:underline disabled:opacity-50"
                    >
                      Одобрить
                    </button>
                  )}
                  {c.status === 'active' && (
                    <button
                      type="button"
                      onClick={() => unpublish.mutate(c.id)}
                      disabled={busy}
                      className="text-amber-700 hover:underline disabled:opacity-50"
                    >
                      Снять
                    </button>
                  )}
                  {c.status !== 'inactive' && (
                    <button
                      type="button"
                      onClick={() => reject.mutate(c.id)}
                      disabled={busy}
                      className="text-red-600 hover:underline disabled:opacity-50"
                    >
                      Отклонить
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
