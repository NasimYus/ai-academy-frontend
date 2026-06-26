import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import {
  adminReviewsQueryOptions,
  useApproveReview,
  useRejectReview,
} from '#/features/moderate-reviews'

export function AdminReviewsPage() {
  const { data, isPending, isError, error } = useQuery(adminReviewsQueryOptions)
  const approve = useApproveReview()
  const reject = useRejectReview()
  const busy = approve.isPending || reject.isPending

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Модерация отзывов</h1>
        <span className="flex gap-3 text-sm">
          <Link to="/admin/courses" className="text-brand-600 hover:underline">
            Курсы →
          </Link>
          <Link to="/admin/users" className="text-brand-600 hover:underline">
            Пользователи →
          </Link>
        </span>
      </div>

      {isPending ? (
        <p className="text-ink/60">Загрузка…</p>
      ) : isError ? (
        <p className="text-red-600">{error.message}</p>
      ) : data.reviews.length === 0 ? (
        <p className="text-ink/60">Нет отзывов на модерации.</p>
      ) : (
        <ul className="space-y-2">
          {data.reviews.map((r) => (
            <li key={r.id} className="rounded-xl border border-brand-100 bg-white px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-ink">{r.user?.full_name ?? 'Аноним'}</span>
                <span className="text-sm text-amber-500">★ {r.rates}</span>
              </div>
              {r.description && <p className="mt-1 text-sm text-ink/70">{r.description}</p>}
              <div className="mt-2 flex gap-3 text-sm">
                <button
                  type="button"
                  onClick={() => approve.mutate(r.id)}
                  disabled={busy}
                  className="text-green-700 hover:underline disabled:opacity-50"
                >
                  Одобрить
                </button>
                <button
                  type="button"
                  onClick={() => reject.mutate(r.id)}
                  disabled={busy}
                  className="text-red-600 hover:underline disabled:opacity-50"
                >
                  Отклонить
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
