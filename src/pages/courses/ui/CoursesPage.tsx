import { useQuery } from '@tanstack/react-query'

import { CourseCard, coursesQueryOptions } from '#/entities/course'

export function CoursesPage() {
  const courses = useQuery(coursesQueryOptions)

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-ink">Курсы</h1>

      {courses.isPending && <p className="text-ink/60">Загрузка…</p>}
      {courses.isError && <p className="text-red-600">{(courses.error as Error).message}</p>}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {courses.data?.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}
