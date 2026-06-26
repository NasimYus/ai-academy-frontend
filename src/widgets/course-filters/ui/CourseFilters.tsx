import { useQuery } from '@tanstack/react-query'

import { categoriesQueryOptions } from '#/entities/category'
import type { CourseFilters as Filters } from '#/entities/course'
import { Select } from '#/shared/ui'

const TYPES: Array<{ value: NonNullable<Filters['type']>; label: string }> = [
  { value: 'course', label: 'Курс' },
  { value: 'webinar', label: 'Вебинар' },
  { value: 'text_lesson', label: 'Текстовый' },
]

const SORTS: Array<{ value: NonNullable<Filters['sort']>; label: string }> = [
  { value: 'newest', label: 'Сначала новые' },
  { value: 'oldest', label: 'Сначала старые' },
  { value: 'expensive', label: 'Дороже' },
  { value: 'cheapest', label: 'Дешевле' },
]

export function CourseFilters({
  value,
  onChange,
}: {
  value: Filters
  onChange: (filters: Filters) => void
}) {
  const categories = useQuery(categoriesQueryOptions)

  // Flatten top-level + sub-categories into selectable options.
  const options = (categories.data ?? []).flatMap((top) => [
    { id: top.id, title: top.title },
    ...top.sub_categories.map((sub) => ({ id: sub.id, title: `— ${sub.title}` })),
  ])

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      <Select
        value={value.cat ?? ''}
        onChange={(e) =>
          onChange({ ...value, cat: e.target.value ? Number(e.target.value) : undefined })
        }
      >
        <option value="">Все категории</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.title}
          </option>
        ))}
      </Select>

      <Select
        value={value.type ?? ''}
        onChange={(e) =>
          onChange({ ...value, type: (e.target.value || undefined) as Filters['type'] })
        }
      >
        <option value="">Все типы</option>
        {TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </Select>

      <Select
        value={value.sort ?? 'newest'}
        onChange={(e) => onChange({ ...value, sort: e.target.value as Filters['sort'] })}
      >
        {SORTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </Select>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          checked={value.free ?? false}
          onChange={(e) => onChange({ ...value, free: e.target.checked || undefined })}
        />
        Только бесплатные
      </label>
    </div>
  )
}
