import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ChevronRight, ClipboardList } from 'lucide-react'

import { openQuizzesQueryOptions } from '#/entities/quiz'
import { PageHeader, Spinner } from '#/shared/ui'
import { PanelLayout } from '#/widgets/panel-layout'

export function QuizOpensPage() {
  const { data, isPending, isError, error } = useQuery(openQuizzesQueryOptions)

  return (
    <PanelLayout>
      <PageHeader
        title="Не участвовал"
        subtitle="Активные тесты ваших курсов, которые ещё не пройдены"
      />
      {isPending ? (
        <Spinner />
      ) : isError ? (
        <p className="text-red-600">{error.message}</p>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-brand-200 bg-white p-12 text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
            <ClipboardList className="size-6" />
          </span>
          <h5 className="mt-3 text-sm font-semibold text-ink">Нет тестов!</h5>
          <p className="mt-1 text-xs text-ink/50">
            У вас нет непройденных тестов или тестов на проверке.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((q) => (
            <Link
              key={q.id}
              to="/quiz/$quizId"
              params={{ quizId: String(q.id) }}
              className="flex items-center justify-between rounded-2xl bg-white p-4 transition hover:bg-brand-50/40"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-ink">{q.title}</p>
                <p className="mt-0.5 text-xs text-ink/50">{q.question_count} вопросов</p>
              </div>
              <ChevronRight className="size-4 text-ink/40" />
            </Link>
          ))}
        </div>
      )}
    </PanelLayout>
  )
}
