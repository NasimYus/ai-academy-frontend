import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { classesQueryOptions, useDeleteCourse } from '#/features/manage-course'

export function InstructorPage() {
  const classes = useQuery(classesQueryOptions)
  const del = useDeleteCourse()

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Мои курсы</h1>
        <div className="flex items-center gap-3">
          <Link to="/instructor/quizzes" className="text-sm text-brand-600 hover:underline">
            Тесты
          </Link>
          <Link to="/instructor/assignments" className="text-sm text-brand-600 hover:underline">
            Задания
          </Link>
          <Link to="/instructor/comments" className="text-sm text-brand-600 hover:underline">
            Комментарии
          </Link>
          <Link to="/instructor/bundles" className="text-sm text-brand-600 hover:underline">
            Наборы
          </Link>
          <Link
            to="/instructor/course/new"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Создать курс
          </Link>
        </div>
      </div>

      {classes.isPending && <p className="text-ink/60">Загрузка…</p>}
      {classes.data && classes.data.length === 0 && (
        <p className="text-ink/60">У вас пока нет курсов.</p>
      )}

      <div className="space-y-2">
        {classes.data?.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between rounded-lg border border-brand-100 bg-white p-4"
          >
            <div>
              <p className="font-medium text-ink">{c.title}</p>
              <p className="text-xs text-ink/50">
                {c.status} · {c.type}
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Link
                to="/instructor/course/$courseId/edit"
                params={{ courseId: String(c.id) }}
                className="text-brand-600 hover:underline"
              >
                Редактировать
              </Link>
              <button
                type="button"
                onClick={() => del.mutate(c.id)}
                disabled={del.isPending}
                className="text-red-600 hover:underline disabled:opacity-50"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
