import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { courseStatisticsQueryOptions } from '#/features/manage-course'

const LABELS: Record<string, string> = {
  students_count: 'Студентов',
  sales_count: 'Продаж',
  sales_amount: 'Доход',
  rate: 'Рейтинг',
  reviews_count: 'Отзывов',
  comments_count: 'Комментариев',
  chapters_count: 'Глав',
  sessions_count: 'Сессий',
  files_count: 'Файлов',
  text_lessons_count: 'Текстовых уроков',
  quizzes_count: 'Тестов',
  assignments_count: 'Заданий',
  forums_count: 'Форумов',
}

export function InstructorStatisticsPage({ courseId }: { courseId: number }) {
  const stats = useQuery(courseStatisticsQueryOptions(courseId))

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Статистика курса</h1>
        <Link to="/instructor" className="text-sm text-brand-600 hover:underline">
          ← К моим курсам
        </Link>
      </div>

      {stats.isPending && <p className="text-ink/60">Загрузка…</p>}
      {stats.isError && <p className="text-red-600">{stats.error.message}</p>}

      {stats.data && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Object.entries(LABELS).map(([key, label]) => (
            <div key={key} className="rounded-lg border border-brand-100 bg-white p-4 text-center">
              <p className="text-2xl font-bold text-ink">
                {(stats.data as Record<string, number>)[key]}
              </p>
              <p className="text-xs text-ink/50">{label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
