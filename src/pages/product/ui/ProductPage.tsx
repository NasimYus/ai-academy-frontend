import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'

import { productQueryOptions } from '#/entities/product'
import { useSessionStore } from '#/entities/session'
import { usePayProduct } from '#/features/buy-product'

export function ProductPage({ productId }: { productId: number }) {
  const token = useSessionStore((s) => s.token)
  const navigate = useNavigate()
  const product = useQuery(productQueryOptions(productId))
  const pay = usePayProduct(productId)

  if (product.isPending) return <p className="mx-auto max-w-3xl px-6 py-8 text-ink/60">Загрузка…</p>
  if (product.isError)
    return <p className="mx-auto max-w-3xl px-6 py-8 text-red-600">{product.error.message}</p>

  const p = product.data
  const isPaid = !!p.price && p.price > 0

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6">
        <Link to="/store" className="text-sm text-brand-600 hover:underline">
          ← В магазин
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-ink">{p.title}</h1>
      <p className="mt-1 text-sm text-ink/60">
        {p.category_title ?? '—'} · {p.type === 'physical' ? 'Физический' : 'Цифровой'} ·{' '}
        {p.price ? `${p.price}` : 'Бесплатно'}
        {p.point ? ` · ${p.point} баллов` : ''}
      </p>

      {p.description && <p className="mt-4 whitespace-pre-line text-ink/80">{p.description}</p>}

      <p className="mt-6 text-sm text-ink/50">
        {p.unlimited_inventory
          ? 'В наличии'
          : p.inventory != null
            ? `Осталось: ${p.inventory}`
            : ''}
      </p>

      {token && isPaid && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() =>
              pay.mutate({ quantity: 1 }, { onSuccess: () => void navigate({ to: '/orders' }) })
            }
            disabled={pay.isPending}
            className="rounded-lg bg-brand-600 px-5 py-2.5 font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
          >
            {pay.isPending ? '…' : `Купить за ${p.price}`}
          </button>
          {pay.isError && <p className="mt-2 text-sm text-red-600">{pay.error.message}</p>}
        </div>
      )}
    </div>
  )
}
