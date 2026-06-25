import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { productQueryOptions } from '#/entities/product'

export function ProductPage({ productId }: { productId: number }) {
  const product = useQuery(productQueryOptions(productId))

  if (product.isPending) return <p className="mx-auto max-w-3xl px-6 py-8 text-ink/60">Загрузка…</p>
  if (product.isError)
    return <p className="mx-auto max-w-3xl px-6 py-8 text-red-600">{product.error.message}</p>

  const p = product.data

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
    </div>
  )
}
