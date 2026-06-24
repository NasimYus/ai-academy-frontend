import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { CourseForm, editCourseQueryOptions } from '#/features/manage-course'

export function CourseFormPage({ courseId }: { courseId?: number }) {
  const isEdit = courseId != null
  const course = useQuery({ ...editCourseQueryOptions(courseId ?? 0), enabled: isEdit })

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">{isEdit ? 'Редактирование курса' : 'Новый курс'}</h1>
        <Link to="/instructor" className="text-sm text-brand-600 hover:underline">
          ← К моим курсам
        </Link>
      </div>

      {isEdit && course.isPending && <p className="text-ink/60">Загрузка…</p>}
      {isEdit && course.isError && <p className="text-red-600">{course.error.message}</p>}
      {(!isEdit || course.data) && <CourseForm course={course.data} />}
    </div>
  )
}
