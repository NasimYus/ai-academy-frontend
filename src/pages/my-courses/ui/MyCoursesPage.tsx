import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { CourseCard, myCoursesQueryOptions } from '#/entities/course'

export function MyCoursesPage() {
  const courses = useQuery(myCoursesQueryOptions)

  if (courses.isPending)
    return <p className="mx-auto max-w-5xl px-6 py-8 text-ink/60">Загрузка…</p>
  if (courses.isError)
    return <p className="mx-auto max-w-5xl px-6 py-8 text-red-600">{courses.error.message}</p>

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-ink">Мои курсы</h1>

      {courses.data.length === 0 ? (
        <p className="text-ink/60">
          У вас пока нет курсов.{' '}
          <Link to="/courses" className="text-brand-600 hover:underline">
            Перейти к каталогу
          </Link>
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.data.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}
