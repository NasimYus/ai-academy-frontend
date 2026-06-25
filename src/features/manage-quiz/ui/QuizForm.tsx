import { useState } from 'react'

import type { QuizCreateBody, QuizManage } from '#/features/manage-quiz/api/manage'
import { useCreateQuiz, useUpdateQuiz } from '#/features/manage-quiz/model/use-manage'

interface CourseOption {
  id: number
  title: string
}

/** Create or edit a quiz shell. Pass `quiz` to edit, omit to create. */
export function QuizForm({
  courses,
  quiz,
  onDone,
}: {
  courses: CourseOption[]
  quiz?: QuizManage
  onDone?: () => void
}) {
  const create = useCreateQuiz()
  const update = useUpdateQuiz(quiz?.id ?? 0)
  const mutation = quiz ? update : create

  const firstCourseId = courses.length > 0 ? courses[0].id : ''
  const [title, setTitle] = useState(quiz?.title ?? '')
  const [courseId, setCourseId] = useState<number | ''>(quiz?.course_id ?? firstCourseId)
  const [passMark, setPassMark] = useState(String(quiz?.pass_mark ?? 50))
  const [attempt, setAttempt] = useState(quiz?.attempt != null ? String(quiz.attempt) : '')
  const [time, setTime] = useState(quiz?.time != null ? String(quiz.time) : '')
  const [active, setActive] = useState(quiz ? quiz.status === 'active' : true)
  const [certificate, setCertificate] = useState(quiz?.certificate ?? false)

  const canSubmit = title.trim().length >= 1 && courseId !== '' && passMark !== ''

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    const body: QuizCreateBody = {
      title,
      course_id: Number(courseId),
      pass_mark: Number(passMark),
      attempt: attempt ? Number(attempt) : null,
      time: time ? Number(time) : null,
      active,
      certificate,
    }
    mutation.mutate(body, {
      onSuccess: () => {
        if (!quiz) {
          setTitle('')
          setPassMark('50')
          setAttempt('')
          setTime('')
        }
        onDone?.()
      },
    })
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl border border-brand-100 bg-white p-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Название теста"
        className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm"
      />
      <select
        value={courseId}
        onChange={(e) => setCourseId(e.target.value ? Number(e.target.value) : '')}
        className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm"
      >
        <option value="">Выберите курс…</option>
        {courses.map((c) => (
          <option key={c.id} value={c.id}>
            {c.title}
          </option>
        ))}
      </select>
      <div className="flex gap-3">
        <label className="flex-1 text-sm text-ink/70">
          Проходной балл
          <input
            type="number"
            value={passMark}
            onChange={(e) => setPassMark(e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="flex-1 text-sm text-ink/70">
          Попытки
          <input
            type="number"
            value={attempt}
            onChange={(e) => setAttempt(e.target.value)}
            placeholder="∞"
            className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="flex-1 text-sm text-ink/70">
          Время (мин)
          <input
            type="number"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm"
          />
        </label>
      </div>
      <div className="flex gap-4 text-sm text-ink/70">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          Активен
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={certificate}
            onChange={(e) => setCertificate(e.target.checked)}
          />
          Сертификат
        </label>
      </div>

      {mutation.isError && <p className="text-sm text-red-600">{mutation.error.message}</p>}

      <button
        type="submit"
        disabled={!canSubmit || mutation.isPending}
        className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
      >
        {mutation.isPending ? 'Сохранение…' : quiz ? 'Сохранить' : 'Создать тест'}
      </button>
    </form>
  )
}
