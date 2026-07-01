import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Award, ClipboardList, Pencil, Plus } from 'lucide-react'

import { manageQuizzesQueryOptions } from '#/features/manage-course/api/quizzes'
import { EmptyState, Spinner } from '#/shared/ui'

export function Step7Quiz({ courseId }: { courseId: number }) {
  const dashboard = useQuery(manageQuizzesQueryOptions)
  const quizzes = (dashboard.data?.quizzes ?? []).filter((q) => q.course_id === courseId)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-brand-100 p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
            <ClipboardList className="size-5" strokeWidth={1.8} />
          </span>
          <div>
            <p className="text-sm font-bold text-ink">Новый тест</p>
            <p className="text-xs text-ink/55">Создайте викторину и привяжите её к курсу.</p>
          </div>
        </div>
        <Link
          to="/instructor/quizzes/new"
          className="flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
        >
          <Plus className="size-4" /> Новый тест
        </Link>
      </div>

      {dashboard.isPending && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}

      {dashboard.data && quizzes.length === 0 && (
        <EmptyState icon="📝">
          <p className="font-semibold text-ink">Для этого курса тестов не создано!</p>
          <p className="mt-1 text-sm">Создайте тесты, чтобы оценивать учащихся и выдавать сертификаты.</p>
        </EmptyState>
      )}

      <div className="space-y-2">
        {quizzes.map((q) => (
          <div
            key={q.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-brand-100 p-4"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-bold text-ink">{q.title}</p>
                {q.certificate && (
                  <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] text-amber-700">
                    <Award className="size-3" /> Сертификат
                  </span>
                )}
              </div>
              <p className="text-xs text-ink/50">
                {q.question_count} вопр. · проходной балл {q.pass_mark} ·{' '}
                {q.status === 'active' ? 'Активен' : 'Черновик'}
              </p>
            </div>
            <Link
              to="/instructor/quizzes/$quizId/edit"
              params={{ quizId: String(q.id) }}
              aria-label="Редактировать"
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-ink/50 hover:bg-brand-50 hover:text-brand-600"
            >
              <Pencil className="size-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
