import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { bundlesQueryOptions } from '#/entities/bundle'

export function BundlesPage() {
  const bundles = useQuery(bundlesQueryOptions)

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-ink">Наборы курсов</h1>

      {bundles.isPending && <p className="text-ink/60">Загрузка…</p>}
      {bundles.data && bundles.data.length === 0 && (
        <p className="text-ink/60">Пока нет доступных наборов.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bundles.data?.map((b) => (
          <Link
            key={b.id}
            to="/bundles/$bundleId"
            params={{ bundleId: String(b.id) }}
            className="rounded-lg border border-brand-100 bg-white p-4 hover:border-brand-300"
          >
            <p className="font-medium text-ink">{b.title}</p>
            <p className="mt-1 text-xs text-ink/50">
              {b.webinars_count} курс(ов) · {b.price ? `${b.price}` : 'Бесплатно'}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
