import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { productCategoriesQueryOptions, productsQueryOptions } from '#/entities/product'

export function StorePage() {
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined)
  const categories = useQuery(productCategoriesQueryOptions)
  const products = useQuery(productsQueryOptions(categoryId))

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-ink">Магазин</h1>

      {categories.data && categories.data.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategoryId(undefined)}
            className={`rounded-full px-3 py-1 text-sm ${
              categoryId === undefined ? 'bg-brand-600 text-white' : 'border border-brand-200 text-ink/70'
            }`}
          >
            Все
          </button>
          {categories.data.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategoryId(c.id)}
              className={`rounded-full px-3 py-1 text-sm ${
                categoryId === c.id ? 'bg-brand-600 text-white' : 'border border-brand-200 text-ink/70'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>
      )}

      {products.isPending && <p className="text-ink/60">Загрузка…</p>}
      {products.data && products.data.length === 0 && (
        <p className="text-ink/60">Пока нет товаров.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.data?.map((p) => (
          <Link
            key={p.id}
            to="/store/$productId"
            params={{ productId: String(p.id) }}
            className="rounded-lg border border-brand-100 bg-white p-4 hover:border-brand-300"
          >
            <p className="font-medium text-ink">{p.title}</p>
            <p className="mt-1 text-xs text-ink/50">
              {p.type === 'physical' ? 'Физический' : 'Цифровой'} ·{' '}
              {p.price ? `${p.price}` : 'Бесплатно'}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
