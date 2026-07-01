import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Download } from 'lucide-react'
import type { ReactNode } from 'react'

import { adminLiveSessionsQueryOptions } from '#/entities/admin-course-manage'
import { PageHeader, Spinner } from '#/shared/ui'
import { PanelLayout } from '#/widgets/panel-layout'

function Th({ children }: { children: ReactNode }) {
  return (
    <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-ink/40">
      {children}
    </th>
  )
}

export function AdminLiveSessionsPage() {
  const { data, isPending, isError, error } = useQuery(adminLiveSessionsQueryOptions(1))

  return (
    <PanelLayout>
      <PageHeader
        title="История живых сессий"
        actions={
          <span className="text-sm text-ink/45">
            <Link to="/admin" className="text-brand-600 hover:underline">
              Панель управления
            </Link>{' '}
            / История живых сессий
          </span>
        }
      />

      <div className="rounded-2xl bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-display font-bold text-ink">История живых сессий</h3>
            <p className="mt-1 text-sm text-ink/45">
              Управляйте всеми курсами и проверяйте ожидающие публикации.
            </p>
          </div>
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-2 rounded-xl border border-brand-100 px-4 py-2 text-sm font-medium text-ink/40"
          >
            <Download className="size-4" />
            Экспорт в Excel
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          {isPending ? (
            <Spinner />
          ) : isError ? (
            <p className="text-red-600">{error.message}</p>
          ) : (
            <table className="w-full min-w-[52rem]">
              <thead>
                <tr className="border-b border-brand-50">
                  <Th>Курс</Th>
                  <Th>Прямая сессия</Th>
                  <Th>Продолжительность сессии</Th>
                  <Th>Дата начала</Th>
                  <Th>Дата окончания</Th>
                  <Th>Продолжительность встречи</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50">
                {data.sessions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-12 text-center text-sm text-ink/40">
                      Живых сессий пока нет
                    </td>
                  </tr>
                ) : (
                  data.sessions.map((s) => (
                    <tr key={s.id}>
                      <td className="px-3 py-4 text-sm text-ink">{s.course_title ?? '—'}</td>
                      <td className="px-3 py-4 text-sm text-ink/70">{s.session_title ?? '—'}</td>
                      <td className="px-3 py-4 text-sm text-ink/70">
                        {s.session_duration ?? '—'}
                      </td>
                      <td className="px-3 py-4 text-sm text-ink/70">{s.start_date ?? '—'}</td>
                      <td className="px-3 py-4 text-sm text-ink/70">{s.end_date ?? '—'}</td>
                      <td className="px-3 py-4 text-sm text-ink/70">
                        {s.meeting_duration ?? '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </PanelLayout>
  )
}
