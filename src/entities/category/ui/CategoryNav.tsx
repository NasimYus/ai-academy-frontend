import { useQuery } from '@tanstack/react-query'

import { categoriesQueryOptions } from '#/entities/category/api/categories'

// Horizontal list of top-level categories. Selection/filtering arrives in 2.3.
export function CategoryNav() {
  const categories = useQuery(categoriesQueryOptions)

  if (categories.isPending || categories.isError) return null
  if (categories.data.length === 0) return null

  return (
    <nav className="mb-6 flex flex-wrap gap-2">
      {categories.data.map((category) => (
        <span
          key={category.id}
          className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white px-3 py-1.5 text-sm font-medium text-ink/80"
        >
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: category.color ?? 'var(--color-brand-300, #c4b5fd)' }}
          />
          {category.title}
        </span>
      ))}
    </nav>
  )
}
