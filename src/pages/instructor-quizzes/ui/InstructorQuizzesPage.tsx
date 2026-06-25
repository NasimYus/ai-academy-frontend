import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'

import { classesQueryOptions } from '#/features/manage-course'
import { QuizForm, quizResultsQueryOptions, useDeleteQuiz } from '#/features/manage-quiz'
import type { QuizManage } from '#/features/manage-quiz'

const STATUS_RU: Record<string, string> = {
  passed: 'Сдан',
  failed: 'Не сдан',
  waiting: 'На проверке',
}

export function InstructorQuizzesPage() {
  const classes = useQuery(classesQueryOptions)
  const dashboard = useQuery(quizResultsQueryOptions)
  const del = useDeleteQuiz()
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<QuizManage | null>(null)

  const courses = (classes.data ?? []).map((c) => ({ id: c.id, title: c.title }))

  if (dashboard.isPending) return <p className="mx-auto max-w-3xl px-6 py-8 text-ink/60">Загрузка…</p>
  if (dashboard.isError)
    return <p className="mx-auto max-w-3xl px-6 py-8 text-red-600">{dashboard.error.message}</p>

  const { quizzes, results, quiz_results_count, passed_count, waiting_count, success_rate, avg_grade } =
    dashboard.data

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Мои тесты</h1>
        <Link to="/instructor" className="text-sm text-brand-600 hover:underline">
          ← К курсам
        </Link>
      </div>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink/70">Тесты ({quizzes.length})</h2>
          <button
            type="button"
            onClick={() => {
              setCreating((v) => !v)
              setEditing(null)
            }}
            className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-700"
          >
            {creating ? 'Отмена' : 'Новый тест'}
          </button>
        </div>

        {creating && <QuizForm courses={courses} onDone={() => setCreating(false)} />}

        {quizzes.map((q) =>
          editing?.id === q.id ? (
            <QuizForm key={q.id} courses={courses} quiz={q} onDone={() => setEditing(null)} />
          ) : (
            <div
              key={q.id}
              className="flex items-center justify-between rounded-lg border border-brand-100 bg-white p-4"
            >
              <div>
                <p className="font-medium text-ink">{q.title}</p>
                <p className="text-xs text-ink/50">
                  {q.status} · проходной {q.pass_mark}
                  {q.certificate ? ' · сертификат' : ''}
                </p>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(q)
                    setCreating(false)
                  }}
                  className="text-brand-600 hover:underline"
                >
                  Редактировать
                </button>
                <button
                  type="button"
                  onClick={() => del.mutate(q.id)}
                  disabled={del.isPending}
                  className="text-red-600 hover:underline disabled:opacity-50"
                >
                  Удалить
                </button>
              </div>
            </div>
          ),
        )}
        {quizzes.length === 0 && !creating && <p className="text-ink/60">Тестов пока нет.</p>}
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-ink/70">Результаты студентов</h2>
        <div className="grid grid-cols-4 gap-3 text-center">
          {[
            ['Всего', quiz_results_count],
            ['Сдали', passed_count],
            ['На проверке', waiting_count],
            ['Успех, %', success_rate],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-brand-100 bg-white p-3">
              <div className="text-lg font-bold text-ink">{value}</div>
              <div className="text-xs text-ink/50">{label}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-ink/50">Средний балл: {avg_grade}</p>

        {results.length === 0 ? (
          <p className="text-ink/60">Пока нет попыток.</p>
        ) : (
          <ul className="space-y-2">
            {results.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between rounded-lg border border-brand-100 bg-white px-4 py-2 text-sm"
              >
                <span className="text-ink">{r.user?.full_name ?? 'Студент'}</span>
                <span className="text-ink/60">{r.quiz_title}</span>
                <span className="text-ink/80">
                  {r.user_grade ?? 0} · {STATUS_RU[r.status] ?? r.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
