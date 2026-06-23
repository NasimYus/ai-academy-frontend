import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import {
  CourseCard,
  coursesQueryOptions,
  featuredCoursesQueryOptions,
} from '#/entities/course'
import type { CourseFilters as Filters } from '#/entities/course'
import { CourseFilters } from '#/widgets/course-filters'

export function CoursesPage() {
  const [filters, setFilters] = useState<Filters>({ sort: 'newest' })
  const courses = useQuery(coursesQueryOptions(filters))
  const featured = useQuery(featuredCoursesQueryOptions)

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-ink">Курсы</h1>

      {featured.data && featured.data.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 font-display text-lg font-bold text-ink">Рекомендуемые</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.data.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </section>
      )}

      <CourseFilters value={filters} onChange={setFilters} />

      {courses.isPending && <p className="text-ink/60">Загрузка…</p>}
      {courses.isError && <p className="text-red-600">{courses.error.message}</p>}

      {courses.data && courses.data.length === 0 && (
        <p className="text-ink/60">Ничего не найдено по выбранным фильтрам.</p>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {courses.data?.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}
