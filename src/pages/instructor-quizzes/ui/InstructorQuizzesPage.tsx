import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import { ClipboardCheck, MoreHorizontal, Plus, Users } from 'lucide-react'
import { useState } from 'react'

import { classesQueryOptions } from '#/features/manage-course'
import { quizResultsQueryOptions, useDeleteQuiz } from '#/features/manage-quiz'
import { Badge, Button, PageHeader, Spinner } from '#/shared/ui'
import { PanelLayout } from '#/widgets/panel-layout'

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))

function StatCard({
  label,
  value,
  icon,
  tone,
}: {
  label: string
  value: number
  icon: React.ReactNode
  tone: string
}) {
  return (
    <div className="flex items-center justify-between rounded-3xl bg-white p-5">
      <div>
        <span className="text-sm text-ink/50">{label}</span>
        <span className="mt-2 block font-display text-3xl font-bold text-ink">{value}</span>
      </div>
      <span className={`flex size-11 items-center justify-center rounded-xl ${tone}`}>{icon}</span>
    </div>
  )
}

export function InstructorQuizzesPage() {
  const navigate = useNavigate()
  const classes = useQuery(classesQueryOptions)
  const dashboard = useQuery(quizResultsQueryOptions)
  const del = useDeleteQuiz()
  const [menuId, setMenuId] = useState<number | null>(null)

  if (dashboard.isPending) {
    return (
      <PanelLayout>
        <Spinner />
      </PanelLayout>
    )
  }
  if (dashboard.isError) {
    return (
      <PanelLayout>
        <p className="text-red-600">{dashboard.error.message}</p>
      </PanelLayout>
    )
  }

  const { quizzes, results } = dashboard.data
  const courseTitle = new Map((classes.data ?? []).map((c) => [c.id, c.title]))
  const totalQuestions = quizzes.reduce((sum, q) => sum + q.question_count, 0)
  const distinctStudents = new Set(results.map((r) => r.user?.id).filter(Boolean)).size

  return (
    <PanelLayout>
      <PageHeader title="Список тестов" />

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Тесты"
          value={quizzes.length}
          icon={<ClipboardCheck className="size-5" />}
          tone="bg-brand-50 text-brand-600"
        />
        <StatCard
          label="Вопросы"
          value={totalQuestions}
          icon={<ClipboardCheck className="size-5" />}
          tone="bg-red-50 text-red-500"
        />
        <StatCard
          label="Студенты"
          value={distinctStudents}
          icon={<Users className="size-5" />}
          tone="bg-amber-50 text-amber-500"
        />
      </div>

      {/* Table */}
      <div className="mt-6 rounded-3xl bg-white p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-ink">Тесты</h3>
            <p className="mt-1 text-sm text-ink/50">
              Управляйте всеми тестами, отслеживайте статус и редактируйте их.
            </p>
          </div>
          <Link to="/instructor/quizzes/new">
            <Button size="sm" className="gap-1.5">
              <Plus className="size-4" />
              Новый тест
            </Button>
          </Link>
        </div>

        {quizzes.length === 0 ? (
          <div className="mt-6 flex flex-col items-center rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 p-12 text-center">
            <span className="flex size-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
              <ClipboardCheck className="size-6" />
            </span>
            <h5 className="mt-3 text-sm font-semibold text-ink">Тестов пока нет</h5>
            <p className="mt-1 text-xs text-ink/50">Создайте первый тест для вашего курса.</p>
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b border-brand-50 text-left text-xs font-bold uppercase tracking-wide text-ink/40">
                  <th className="pb-3">Название</th>
                  <th className="pb-3 text-center">Вопросы</th>
                  <th className="pb-3 text-center">Время (мин)</th>
                  <th className="pb-3 text-center">Общий балл</th>
                  <th className="pb-3 text-center">Проходной</th>
                  <th className="pb-3 text-center">Студенты</th>
                  <th className="pb-3 text-center">Статус</th>
                  <th className="pb-3">Дата создания</th>
                  <th className="pb-3 text-right">Действия</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((q) => (
                  <tr key={q.id} className="border-b border-brand-50/60">
                    <td className="py-3">
                      <p className="font-medium text-ink">{q.title}</p>
                      <p className="text-xs text-ink/45">{courseTitle.get(q.course_id) ?? '—'}</p>
                    </td>
                    <td className="py-3 text-center text-ink/70">{q.question_count}</td>
                    <td className="py-3 text-center text-ink/70">{q.time || '—'}</td>
                    <td className="py-3 text-center text-ink/70">{q.total_mark}</td>
                    <td className="py-3 text-center text-ink/70">{q.pass_mark}</td>
                    <td className="py-3 text-center text-ink/70">{q.students_count}</td>
                    <td className="py-3 text-center">
                      <Badge tone={q.status === 'active' ? 'success' : 'danger'}>
                        {q.status === 'active' ? 'Активно' : 'Неактивно'}
                      </Badge>
                    </td>
                    <td className="py-3 text-ink/50">{fmtDate(q.created_at)}</td>
                    <td className="relative py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setMenuId(menuId === q.id ? null : q.id)}
                        className="rounded-lg p-2 text-ink/50 transition hover:bg-brand-50"
                        aria-label="Действия"
                      >
                        <MoreHorizontal className="size-4" />
                      </button>
                      {menuId === q.id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setMenuId(null)} />
                          <div className="absolute right-2 top-11 z-20 w-40 overflow-hidden rounded-xl border border-brand-100 bg-white py-1 text-left shadow-lg">
                            <button
                              type="button"
                              onClick={() => {
                                setMenuId(null)
                                void navigate({
                                  to: '/instructor/quizzes/$quizId/edit',
                                  params: { quizId: String(q.id) },
                                })
                              }}
                              className="block w-full px-4 py-2 text-sm text-ink transition hover:bg-brand-50"
                            >
                              Редактировать
                            </button>
                            <button
                              type="button"
                              disabled={del.isPending}
                              onClick={() => {
                                setMenuId(null)
                                del.mutate(q.id)
                              }}
                              className="block w-full px-4 py-2 text-left text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                            >
                              Удалить
                            </button>
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PanelLayout>
  )
}
