import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { quizQueryOptions } from '#/entities/quiz'
import type { Question, QuizDetail, QuizResult, QuizStartResult } from '#/entities/quiz'
import type { AnswerValue } from '#/features/take-quiz/model/answer-sheet'
import { buildAnswerSheet } from '#/features/take-quiz/model/answer-sheet'
import { useStartQuiz, useStoreResult } from '#/features/take-quiz/model/use-take-quiz'

function QuestionField({
  question,
  value,
  onChange,
}: {
  question: Question
  value: AnswerValue | undefined
  onChange: (value: AnswerValue) => void
}) {
  return (
    <fieldset className="rounded-lg border border-brand-100 bg-white p-4">
      <legend className="px-1 font-medium text-ink">
        {question.title}{' '}
        <span className="text-xs font-normal text-ink/50">({question.grade} б.)</span>
      </legend>

      {question.type === 'descriptive' ? (
        <textarea
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="mt-2 w-full rounded-md border border-brand-200 p-2 text-sm focus:ring-brand-500"
          placeholder="Ваш ответ"
        />
      ) : (
        <div className="mt-2 space-y-2">
          {question.answers.map((answer) => (
            <label key={answer.id} className="flex items-center gap-2 text-sm text-ink/90">
              <input
                type="radio"
                name={`q-${question.id}`}
                checked={value === answer.id}
                onChange={() => onChange(answer.id)}
                className="size-4 border-brand-300 text-brand-600 focus:ring-brand-500"
              />
              {answer.title}
            </label>
          ))}
        </div>
      )}
    </fieldset>
  )
}

function ResultView({ result, totalMark }: { result: QuizResult; totalMark: number }) {
  const tone =
    result.status === 'passed'
      ? { label: 'Тест пройден', cls: 'text-green-700 bg-green-50 border-green-200' }
      : result.status === 'waiting'
        ? { label: 'На проверке', cls: 'text-amber-700 bg-amber-50 border-amber-200' }
        : { label: 'Тест не пройден', cls: 'text-red-700 bg-red-50 border-red-200' }

  return (
    <div className={`rounded-lg border p-4 ${tone.cls}`}>
      <p className="text-lg font-bold">{tone.label}</p>
      <p className="mt-1 text-sm">
        Ваш балл: <span className="font-semibold">{result.user_grade ?? 0}</span> из {totalMark}
      </p>
      {result.status === 'waiting' && (
        <p className="mt-1 text-sm">Открытые вопросы оценит преподаватель.</p>
      )}
    </div>
  )
}

export function QuizRunner({ quizId }: { quizId: number }) {
  const intro = useQuery(quizQueryOptions(quizId))
  const start = useStartQuiz()
  const store = useStoreResult()

  const [attempt, setAttempt] = useState<QuizStartResult | null>(null)
  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({})
  const [result, setResult] = useState<QuizResult | null>(null)

  if (intro.isPending) return <p className="text-ink/60">Загрузка теста…</p>
  if (intro.isError) return <p className="text-red-600">{intro.error.message}</p>

  const quiz: QuizDetail = attempt?.quiz ?? intro.data

  const handleStart = () =>
    start.mutate(quizId, {
      onSuccess: (data) => {
        setAttempt(data)
        setAnswers({})
        setResult(null)
      },
    })

  const handleSubmit = () => {
    if (!attempt) return
    const answerSheet = buildAnswerSheet(answers)
    store.mutate(
      { quizId, quizResultId: attempt.quiz_result_id, answerSheet },
      { onSuccess: (data) => setResult(data) },
    )
  }

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold text-ink">{quiz.title}</h1>
        <p className="mt-1 text-sm text-ink/60">
          Вопросов: {quiz.question_count} · Проходной балл: {quiz.pass_mark} из {quiz.total_mark}
          {quiz.time > 0 && ` · ${quiz.time} мин.`}
        </p>
      </header>

      {/* Result */}
      {result && <ResultView result={result} totalMark={quiz.total_mark} />}

      {/* Active attempt */}
      {attempt && !result && (
        <>
          <div className="space-y-3">
            {quiz.questions.map((q) => (
              <QuestionField
                key={q.id}
                question={q}
                value={answers[q.id]}
                onChange={(value) => setAnswers((prev) => ({ ...prev, [q.id]: value }))}
              />
            ))}
          </div>
          {store.isError && <p className="text-sm text-red-600">{store.error.message}</p>}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={store.isPending}
            className="rounded-lg bg-brand-600 px-5 py-2.5 font-medium text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {store.isPending ? 'Отправка…' : 'Завершить тест'}
          </button>
        </>
      )}

      {/* Intro / retake */}
      {!attempt && (
        <div className="space-y-3">
          {quiz.auth_can_start === false && (
            <p className="text-sm text-amber-700">
              {quiz.attempt_state ?? 'Прохождение сейчас недоступно'}
            </p>
          )}
          {start.isError && <p className="text-sm text-red-600">{start.error.message}</p>}
          <button
            type="button"
            onClick={handleStart}
            disabled={start.isPending || quiz.auth_can_start === false}
            className="rounded-lg bg-brand-600 px-5 py-2.5 font-medium text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {start.isPending ? 'Подготовка…' : 'Начать тест'}
          </button>
        </div>
      )}
    </div>
  )
}
