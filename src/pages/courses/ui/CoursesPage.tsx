import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { SearchX } from 'lucide-react'

import { CourseCard, coursesQueryOptions, featuredCoursesQueryOptions } from '#/entities/course'
import type { CourseFilters as Filters } from '#/entities/course'
import { EmptyState, Spinner } from '#/shared/ui'
import { CourseFilters } from '#/widgets/course-filters'

export function CoursesPage() {
  const [filters, setFilters] = useState<Filters>({ sort: 'newest' })
  const courses = useQuery(coursesQueryOptions(filters))
  const featured = useQuery(featuredCoursesQueryOptions)

  return (
    <div>
      {/* Hero band */}
      <section className="border-b border-brand-100 bg-gradient-to-br from-brand-50 to-white">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">Каталог курсов</h1>
          <p className="mt-2 max-w-xl text-ink/60">
            Выбирайте курсы, вебинары и текстовые уроки от практикующих преподавателей.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {featured.data && featured.data.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-4 font-display text-lg font-bold text-ink">Рекомендуемые</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featured.data.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        )}

        <CourseFilters value={filters} onChange={setFilters} />

        {courses.isPending && <Spinner />}
        {courses.isError && <p className="text-red-600">{courses.error.message}</p>}

        {courses.data && courses.data.length === 0 ? (
          <EmptyState icon={<SearchX className="mx-auto size-7" strokeWidth={1.6} />}>
            Ничего не найдено по выбранным фильтрам.
          </EmptyState>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.data?.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
