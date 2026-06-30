import { useQuery } from '@tanstack/react-query'
import { ClipboardCheck } from 'lucide-react'

import { myQuizResultsQueryOptions } from '#/entities/quiz'
import { Badge, PageHeader, Spinner } from '#/shared/ui'
import { PanelLayout } from '#/widgets/panel-layout'

const STATUS: Record<string, { label: string; tone: 'success' | 'warning' | 'danger' }> = {
  passed: { label: 'Пройдено', tone: 'success' },
  failed: { label: 'Не пройдено', tone: 'danger' },
  waiting: { label: 'На проверке', tone: 'warning' },
}

const fmt = (iso: string) =>
  new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }).format(
    new Date(iso),
  )

export function QuizResultsPage() {
  const { data, isPending, isError, error } = useQuery(myQuizResultsQueryOptions)

  return (
    <PanelLayout>
      <PageHeader title="Мои результаты" subtitle="Ваши попытки прохождения тестов" />
      {isPending ? (
        <Spinner />
      ) : isError ? (
        <p className="text-red-600">{error.message}</p>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-brand-200 bg-white p-12 text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
            <ClipboardCheck className="size-6" />
          </span>
          <h5 className="mt-3 text-sm font-semibold text-ink">Результатов нет!</h5>
          <p className="mt-1 text-xs text-ink/50">Вы ещё не проходили тесты.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((r) => {
            const s = STATUS[r.status] ?? STATUS.waiting
            return (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-2xl bg-white p-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">{r.quiz_title}</p>
                  <p className="mt-0.5 text-xs text-ink/50">
                    {fmt(r.created_at)}
                    {r.user_grade != null && ` · ${r.user_grade} баллов`}
                  </p>
                </div>
                <Badge tone={s.tone}>{s.label}</Badge>
              </div>
            )
          })}
        </div>
      )}
    </PanelLayout>
  )
}
