import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ClipboardList } from 'lucide-react'

import { myAssignmentsQueryOptions } from '#/entities/assignment'
import { Badge, PageHeader, Spinner } from '#/shared/ui'
import { PanelLayout } from '#/widgets/panel-layout'

const STATUS: Record<string, { label: string; tone: 'success' | 'warning' | 'danger' | 'neutral' }> =
  {
    passed: { label: 'Сдано', tone: 'success' },
    pending: { label: 'На проверке', tone: 'warning' },
    not_passed: { label: 'Не пройдено', tone: 'danger' },
    not_submitted: { label: 'Не отправлено', tone: 'neutral' },
  }

export function MyAssignmentsPage() {
  const { data, isPending, isError, error } = useQuery(myAssignmentsQueryOptions)

  return (
    <PanelLayout>
      <PageHeader title="Мои задания" subtitle="Ваши работы по курсам и их статус" />
      {isPending ? (
        <Spinner />
      ) : isError ? (
        <p className="text-red-600">{error.message}</p>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center rounded-3xl border border-dashed border-brand-200 bg-white p-12 text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
            <ClipboardList className="size-6" />
          </span>
          <h5 className="mt-3 text-sm font-semibold text-ink">Задания отсутствуют!</h5>
          <p className="mt-1 text-xs text-ink/50">
            У вас нет несданных заданий или заданий на проверке.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.map((h) => {
            const s = STATUS[h.user_status] ?? STATUS.not_submitted
            return (
              <Link
                key={h.id}
                to="/assignment/$assignmentId"
                params={{ assignmentId: String(h.assignment_id) }}
                className="flex items-center justify-between rounded-2xl bg-white p-4 transition hover:bg-brand-50/40"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">{h.title}</p>
                  <p className="mt-0.5 truncate text-xs text-ink/50">{h.course_title}</p>
                </div>
                <Badge tone={s.tone}>{s.label}</Badge>
              </Link>
            )
          })}
        </div>
      )}
    </PanelLayout>
  )
}
