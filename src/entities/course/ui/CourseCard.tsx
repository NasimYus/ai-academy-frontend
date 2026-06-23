import { Link } from '@tanstack/react-router'

import type { Course } from '#/entities/course/model/types'

export function CourseCard({ course }: { course: Course }) {
  return (
    <Link
      to="/course/$slug"
      params={{ slug: course.slug }}
      className="flex flex-col rounded-card border border-brand-100 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow-md"
    >
      {course.image && (
        <img
          src={course.image}
          alt={course.title}
          className="mb-4 h-40 w-full rounded-lg object-cover"
        />
      )}
      <h2 className="font-display text-lg font-bold text-ink">{course.title}</h2>
      {course.teacher?.full_name && (
        <p className="mt-1 text-sm text-ink/60">{course.teacher.full_name}</p>
      )}
      <div className="mt-4 flex items-center justify-between">
        {Number(course.price) === 0 ? (
          <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
            Бесплатно
          </span>
        ) : (
          <span className="inline-flex rounded-full bg-brand-500 px-3 py-1 text-sm font-semibold text-white">
            {course.price_string ?? course.price} TJS
          </span>
        )}
        {course.rate > 0 && <span className="text-sm text-amber-500">★ {course.rate}</span>}
      </div>
    </Link>
  )
}
