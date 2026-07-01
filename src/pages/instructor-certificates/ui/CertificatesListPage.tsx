import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Award } from 'lucide-react'

import { instructorCertificatesQueryOptions } from '#/features/instructor-certificates'
import { EmptyState, PageHeader, Spinner, StatCard } from '#/shared/ui'

export function CertificatesListPage() {
  const { data, isPending, isError, error } = useQuery(instructorCertificatesQueryOptions)

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
        <PageHeader title="Сертификаты" subtitle="Курсы и тесты, выдающие сертификаты." />
        <Link to="/certificates/students" className="text-sm text-brand-600 hover:underline">
          Все студенты →
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <StatCard label="Выдано сертификатов" value={data.certificates_count} />
        <StatCard label="Студентов" value={data.students_count} />
      </div>

      {data.sources.length === 0 ? (
        <EmptyState icon="🏅">
          <p className="font-semibold text-ink">Пока нет источников сертификатов</p>
          <p className="mt-1 text-sm">Включите «сертификат» у теста курса, чтобы выдавать их.</p>
        </EmptyState>
      ) : (
        <div className="space-y-2">
          {data.sources.map((s) => (
            <div
              key={s.quiz_id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-brand-100 p-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Award className="size-5" strokeWidth={1.8} />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink">{s.quiz_title}</p>
                  <p className="text-xs text-ink/50">{s.course_title ?? `Курс #${s.course_id ?? '—'}`}</p>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-600">
                {s.certificates_count} выдано
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
