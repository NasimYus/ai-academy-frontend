import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'

import {
  assignmentDashboardQueryOptions,
  SubmissionThread,
  submissionsQueryOptions,
} from '#/features/grade-assignment'

function Submissions({ assignmentId }: { assignmentId: number }) {
  const { data, isPending, isError, error } = useQuery(submissionsQueryOptions(assignmentId))

  if (isPending) return <p className="px-4 py-2 text-sm text-ink/50">Загрузка работ…</p>
  if (isError) return <p className="px-4 py-2 text-sm text-red-600">{error.message}</p>
  if (data.length === 0) return <p className="px-4 py-2 text-sm text-ink/50">Работ пока нет.</p>

  return (
    <div className="space-y-3 pt-2">
      {data.map((s) => (
        <SubmissionThread key={s.id} submission={s} assignmentId={assignmentId} />
      ))}
    </div>
  )
}

export function InstructorAssignmentsPage() {
  const { data, isPending, isError, error } = useQuery(assignmentDashboardQueryOptions)
  const [open, setOpen] = useState<number | null>(null)

  if (isPending) return <p className="mx-auto max-w-3xl px-6 py-8 text-ink/60">Загрузка…</p>
  if (isError) return <p className="mx-auto max-w-3xl px-6 py-8 text-red-600">{error.message}</p>

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Задания студентов</h1>
        <Link to="/instructor" className="text-sm text-brand-600 hover:underline">
          ← К курсам
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-3 text-center">
        {[
          ['Заданий', data.course_assignments_count],
          ['На проверке', data.pending_reviews_count],
          ['Сдано', data.passed_count],
          ['Не сдано', data.failed_count],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-brand-100 bg-white p-3">
            <div className="text-lg font-bold text-ink">{value}</div>
            <div className="text-xs text-ink/50">{label}</div>
          </div>
        ))}
      </div>

      {data.assignments.length === 0 ? (
        <p className="text-ink/60">У вас пока нет заданий.</p>
      ) : (
        <ul className="space-y-2">
          {data.assignments.map((a) => (
            <li key={a.id} className="rounded-xl border border-brand-100 bg-white">
              <button
                type="button"
                onClick={() => setOpen((v) => (v === a.id ? null : a.id))}
                className="flex w-full items-center justify-between px-4 py-3 text-left"
              >
                <span className="font-medium text-ink">{a.title}</span>
                <span className="text-xs text-ink/50">
                  {a.histories.length} работ · проходной {a.pass_grade ?? '—'}
                </span>
              </button>
              {open === a.id && (
                <div className="border-t border-brand-50 px-4 pb-4">
                  <Submissions assignmentId={a.id} />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
