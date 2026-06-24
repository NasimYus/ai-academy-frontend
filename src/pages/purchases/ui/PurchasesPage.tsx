import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { purchasesQueryOptions } from '#/entities/order'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export function PurchasesPage() {
  const purchases = useQuery(purchasesQueryOptions)

  if (purchases.isPending)
    return <p className="mx-auto max-w-3xl px-6 py-8 text-ink/60">Загрузка…</p>
  if (purchases.isError)
    return <p className="mx-auto max-w-3xl px-6 py-8 text-red-600">{purchases.error.message}</p>

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-ink">История покупок</h1>

      {purchases.data.length === 0 ? (
        <p className="text-ink/60">
          Покупок пока нет.{' '}
          <Link to="/courses" className="text-brand-600 hover:underline">
            К курсам
          </Link>
        </p>
      ) : (
        <div className="space-y-2">
          {purchases.data.map((p, idx) => (
            <div
              key={`${p.order_id}-${p.course_id}-${idx}`}
              className="flex items-center gap-3 rounded-lg border border-brand-100 bg-white p-3"
            >
              {p.thumbnail && (
                <img src={`${API_URL}${p.thumbnail}`} alt="" className="size-14 rounded object-cover" />
              )}
              <div className="min-w-0 flex-1">
                {p.slug ? (
                  <Link
                    to="/course/$slug"
                    params={{ slug: p.slug }}
                    className="block truncate font-medium text-ink hover:underline"
                  >
                    {p.title}
                  </Link>
                ) : (
                  <span className="font-medium text-ink">{p.title ?? `#${p.course_id}`}</span>
                )}
                <p className="text-xs text-ink/50">Заказ #{p.order_id}</p>
              </div>
              <span className="font-semibold text-ink">{p.amount} TJS</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
