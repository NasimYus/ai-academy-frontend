import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { CourseWizard, editCourseQueryOptions } from '#/features/manage-course'
import { Spinner } from '#/shared/ui'

export function CourseFormPage({ courseId, step = 1 }: { courseId?: number; step?: number }) {
  const isEdit = courseId != null
  const course = useQuery({ ...editCourseQueryOptions(courseId ?? 0), enabled: isEdit })

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">
          {isEdit ? 'Редактирование курса' : 'Новый курс'}
        </h1>
        <Link to="/instructor" className="text-sm text-brand-600 hover:underline">
          ← К моим курсам
        </Link>
      </div>

      {isEdit && course.isPending && (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      )}
      {isEdit && course.isError && <p className="text-red-600">{course.error.message}</p>}
      {!isEdit && <CourseWizard step={1} />}
      {isEdit && course.data && <CourseWizard course={course.data} step={step} />}
    </div>
  )
}
