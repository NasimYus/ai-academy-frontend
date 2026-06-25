import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { bundleQueryOptions } from '#/entities/bundle'
import { useBuyBundleWithPoints, useBuyFreeBundle } from '#/features/buy-bundle'
import { useSessionStore } from '#/entities/session'

export function BundlePage({ bundleId }: { bundleId: number }) {
  const token = useSessionStore((s) => s.token)
  const bundle = useQuery(bundleQueryOptions(bundleId))
  const free = useBuyFreeBundle(bundleId)
  const points = useBuyBundleWithPoints(bundleId)

  if (bundle.isPending) return <p className="mx-auto max-w-3xl px-6 py-8 text-ink/60">Загрузка…</p>
  if (bundle.isError)
    return <p className="mx-auto max-w-3xl px-6 py-8 text-red-600">{bundle.error.message}</p>

  const b = bundle.data
  const isFree = !b.price || b.price <= 0
  const done = free.isSuccess || points.isSuccess
  const error = free.error?.message ?? points.error?.message

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6">
        <Link to="/bundles" className="text-sm text-brand-600 hover:underline">
          ← К наборам
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-ink">{b.title}</h1>
      <p className="mt-1 text-sm text-ink/60">
        {b.webinars_count} курс(ов) · {isFree ? 'Бесплатно' : `${b.price}`}
        {b.points ? ` · ${b.points} баллов` : ''}
      </p>

      {token && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {isFree && (
            <button
              type="button"
              onClick={() => free.mutate()}
              disabled={free.isPending || done}
              className="rounded-lg bg-brand-600 px-5 py-2.5 font-medium text-white hover:bg-brand-700 disabled:opacity-50"
            >
              {free.isPending ? '…' : 'Получить бесплатно'}
            </button>
          )}
          {b.points != null && b.points > 0 && (
            <button
              type="button"
              onClick={() => points.mutate()}
              disabled={points.isPending || done}
              className="rounded-lg border border-brand-300 px-5 py-2.5 font-medium text-brand-700 hover:bg-brand-50 disabled:opacity-50"
            >
              {points.isPending ? '…' : `Купить за ${b.points} баллов`}
            </button>
          )}
          {done && <span className="text-sm text-green-700">Доступ открыт!</span>}
          {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
      )}

      <section className="mt-8">
        <h2 className="mb-2 font-display text-lg font-bold text-ink">Курсы в наборе</h2>
        <div className="space-y-2">
          {b.courses.map((c) => (
            <Link
              key={c.id}
              to="/course/$slug"
              params={{ slug: c.slug }}
              className="block rounded-lg border border-brand-100 bg-white p-4 hover:border-brand-300"
            >
              <span className="font-medium text-ink">{c.title}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
