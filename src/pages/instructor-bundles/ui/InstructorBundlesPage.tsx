import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { bundlesQueryOptions, useDeleteBundle } from '#/features/manage-bundle'

export function InstructorBundlesPage() {
  const { data, isPending, isError, error } = useQuery(bundlesQueryOptions)
  const del = useDeleteBundle()

  if (isPending) return <p className="mx-auto max-w-3xl px-6 py-8 text-ink/60">Загрузка…</p>
  if (isError) return <p className="mx-auto max-w-3xl px-6 py-8 text-red-600">{error.message}</p>

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Наборы курсов</h1>
        <Link to="/instructor" className="text-sm text-brand-600 hover:underline">
          ← К курсам
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        {[
          ['Наборов', data.bundles_count],
          ['Часов', data.bundles_hours],
          ['Продаж', data.bundle_sales_count],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-brand-100 bg-white p-3">
            <div className="text-lg font-bold text-ink">{value}</div>
            <div className="text-xs text-ink/50">{label}</div>
          </div>
        ))}
      </div>

      {data.bundles.length === 0 ? (
        <p className="text-ink/60">У вас пока нет наборов.</p>
      ) : (
        <ul className="space-y-2">
          {data.bundles.map((b) => (
            <li
              key={b.id}
              className="flex items-center justify-between rounded-lg border border-brand-100 bg-white p-4"
            >
              <div>
                <p className="font-medium text-ink">{b.title}</p>
                <p className="text-xs text-ink/50">
                  {b.status} · {b.webinars_count} курсов
                  {b.category ? ` · ${b.category}` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => del.mutate(b.id)}
                disabled={del.isPending}
                className="text-sm text-red-600 hover:underline disabled:opacity-50"
              >
                Удалить
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
