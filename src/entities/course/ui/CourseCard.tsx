import type { Course } from '#/entities/course/model/types'

export function CourseCard({ course }: { course: Course }) {
  return (
    <article className="flex flex-col rounded-card border border-brand-100 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow-md">
      <h2 className="font-display text-lg font-bold text-ink">{course.title}</h2>
      <p className="mt-2 flex-1 text-sm text-ink/60">{course.description}</p>
      <div className="mt-4">
        {Number(course.price) === 0 ? (
          <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
            Бесплатно
          </span>
        ) : (
          <span className="inline-flex rounded-full bg-brand-500 px-3 py-1 text-sm font-semibold text-white">
            {course.price} TJS
          </span>
        )}
      </div>
    </article>
  )
}
