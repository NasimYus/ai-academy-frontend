import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { certificateStudentsQueryOptions } from '#/features/instructor-certificates'
import { Avatar, EmptyState, PageHeader, Spinner } from '#/shared/ui'

export function CertificateStudentsPage() {
  const { data, isPending, isError, error } = useQuery(certificateStudentsQueryOptions)

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
        <PageHeader title="Все студенты" subtitle="Кто получил сертификаты по вашим тестам." />
        <Link to="/certificates/list" className="text-sm text-brand-600 hover:underline">
          ← К списку
        </Link>
      </div>

      {data.length === 0 ? (
        <EmptyState icon="🎓">
          <p className="font-semibold text-ink">Сертификаты ещё не выданы</p>
        </EmptyState>
      ) : (
        <div className="space-y-2">
          {data.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-brand-100 p-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Avatar name={c.student_name ?? '?'} size={38} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink">{c.student_name ?? '—'}</p>
                  <p className="truncate text-xs text-ink/50">
                    {c.quiz_title}
                    {c.course_title ? ` · ${c.course_title}` : ''}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-4">
                {c.user_grade != null && (
                  <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-600">
                    Балл {c.user_grade}
                  </span>
                )}
                <span className="text-xs text-ink/40">
                  {new Date(c.created_at).toLocaleDateString('ru')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
