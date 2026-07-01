import { HelpCircle } from 'lucide-react'
import { useState } from 'react'

import type { QuizCreateBody, QuizManage } from '#/features/manage-quiz/api/manage'
import { useCreateQuiz, useUpdateQuiz } from '#/features/manage-quiz/model/use-manage'
import { Button, Field, Select, Textarea } from '#/shared/ui'

interface CourseOption {
  id: number
  title: string
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-3 text-sm text-ink"
    >
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? 'bg-brand-500' : 'bg-brand-100'
        }`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition ${
            checked ? 'left-[22px]' : 'left-0.5'
          }`}
        />
      </span>
      {label}
    </button>
  )
}

/** Create or edit a quiz shell — legacy "Новый тест" two-column layout. */
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
  const [courseId, setCourseId] = useState<number | ''>(quiz?.course_id ?? firstCourseId)
  const [title, setTitle] = useState(quiz?.title ?? '')
  const [description, setDescription] = useState(quiz?.description ?? '')
  const [time, setTime] = useState(quiz?.time ? String(quiz.time) : '')
  const [attempt, setAttempt] = useState(quiz?.attempt != null ? String(quiz.attempt) : '')
  const [passMark, setPassMark] = useState(String(quiz?.pass_mark ?? 50))
  const [expiryDays, setExpiryDays] = useState(
    quiz?.expiry_days != null ? String(quiz.expiry_days) : '',
  )
  const [randomOrder, setRandomOrder] = useState(quiz?.display_questions_randomly ?? false)
  const [certificate, setCertificate] = useState(quiz?.certificate ?? false)
  const [active, setActive] = useState(quiz ? quiz.status === 'active' : false)

  const canSubmit = title.trim().length >= 1 && courseId !== '' && passMark !== ''

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    const body: QuizCreateBody = {
      title,
      course_id: Number(courseId),
      description: description || null,
      pass_mark: Number(passMark),
      attempt: attempt ? Number(attempt) : null,
      time: time ? Number(time) : null,
      expiry_days: expiryDays ? Number(expiryDays) : null,
      display_questions_randomly: randomOrder,
      certificate,
      active,
    }
    mutation.mutate(body, { onSuccess: () => onDone?.() })
  }

  return (
    <form onSubmit={submit}>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left — main info + settings */}
        <div className="rounded-3xl bg-white p-6">
          <h3 className="font-display font-bold text-ink">Основная информация</h3>
          <div className="mt-4 space-y-4">
            <Select
              label="Курс"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value ? Number(e.target.value) : '')}
            >
              <option value="">Выберите курс</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </Select>
            <Field
              label="Название"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <Textarea
              label="Описание"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <h3 className="mt-8 font-display font-bold text-ink">Настройки теста</h3>
          <div className="mt-4 space-y-4">
            <Field
              label="Время (минуты)"
              type="number"
              min={0}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="Оставьте пустым, если нет ограничений"
            />
            <Field
              label="Количество попыток"
              type="number"
              min={1}
              value={attempt}
              onChange={(e) => setAttempt(e.target.value)}
              placeholder="Оставьте пустым, если нет ограничений"
            />
            <Field
              label="Проходной балл"
              type="number"
              min={0}
              value={passMark}
              onChange={(e) => setPassMark(e.target.value)}
              required
            />
            <div>
              <Field
                label="Срок действия (дней)"
                type="number"
                min={0}
                value={expiryDays}
                onChange={(e) => setExpiryDays(e.target.value)}
              />
              <p className="mt-1 text-xs text-ink/45">
                Тест истечёт через указанное число дней после покупки.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Toggle
                checked={randomOrder}
                onChange={setRandomOrder}
                label="Показывать вопросы в случайном порядке"
              />
              <Toggle checked={certificate} onChange={setCertificate} label="С сертификатом" />
              <Toggle checked={active} onChange={setActive} label="Активный тест" />
            </div>
          </div>
        </div>

        {/* Right — questions panel (post-save) */}
        <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-6 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
            <HelpCircle className="size-7" />
          </span>
          <h4 className="mt-4 font-display font-bold text-ink">Вопросы теста</h4>
          <p className="mt-1 text-sm text-ink/50">Добавить вопросы можно после сохранения теста.</p>
        </div>
      </div>

      {mutation.isError && <p className="mt-4 text-sm text-red-600">{mutation.error.message}</p>}

      <div className="mt-6 flex items-center justify-end">
        <Button type="submit" disabled={!canSubmit || mutation.isPending} className="px-8 py-3">
          {mutation.isPending ? 'Сохранение…' : 'Сохранить'}
        </Button>
      </div>
    </form>
  )
}
