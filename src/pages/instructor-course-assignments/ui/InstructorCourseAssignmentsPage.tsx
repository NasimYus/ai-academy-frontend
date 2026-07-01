import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ClipboardList } from 'lucide-react'

import { assignmentDashboardQueryOptions } from '#/features/grade-assignment'
import { EmptyState, PageHeader, Spinner, StatCard } from '#/shared/ui'

export function InstructorCourseAssignmentsPage() {
  const { data, isPending, isError, error } = useQuery(assignmentDashboardQueryOptions)

  if (isPending)
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    )
  if (isError) return <p className="mx-auto max-w-4xl px-6 py-8 text-red-600">{error.message}</p>

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <div className="mb-5 flex items-center justify-between">
        <PageHeader title="Задания моих курсов" subtitle="Обзор всех заданий в ваших курсах." />
        <Link to="/instructor/assignments" className="text-sm text-brand-600 hover:underline">
          К проверке работ →
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Всего заданий" value={data.course_assignments_count} />
        <StatCard label="На проверке" value={data.pending_reviews_count} />
        <StatCard label="Сдано" value={data.passed_count} />
        <StatCard label="Не сдано" value={data.failed_count} />
      </div>

      {data.assignments.length === 0 ? (
        <EmptyState icon="📋">
          <p className="font-semibold text-ink">Заданий пока нет</p>
          <p className="mt-1 text-sm">Задания создаются в контенте курса.</p>
        </EmptyState>
      ) : (
        <div className="space-y-2">
          {data.assignments.map((a) => {
            const pending = a.histories.filter((h) => h.status === 'pending').length
            return (
              <div
                key={a.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-brand-100 p-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
                    <ClipboardList className="size-5" strokeWidth={1.8} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-ink">{a.title}</p>
                    <p className="text-xs text-ink/50">
                      Курс #{a.course_id}
                      {a.pass_grade != null ? ` · проходной балл ${a.pass_grade}` : ''} ·{' '}
                      {a.histories.length} работ
                    </p>
                  </div>
                </div>
                {pending > 0 && (
                  <span className="shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                    {pending} на проверке
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
