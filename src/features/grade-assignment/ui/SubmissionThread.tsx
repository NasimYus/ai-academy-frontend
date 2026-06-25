import { useState } from 'react'

import type { SubmissionView } from '#/features/grade-assignment/api/grade'
import { useGradeSubmission } from '#/features/grade-assignment/model/use-grade'

const STATUS_RU: Record<string, string> = {
  pending: 'На проверке',
  passed: 'Сдано',
  not_passed: 'Не сдано',
  not_submitted: 'Не отправлено',
}

/** One student's submission thread with an inline grade input. */
export function SubmissionThread({
  submission,
  assignmentId,
}: {
  submission: SubmissionView
  assignmentId: number
}) {
  const grade = useGradeSubmission(assignmentId)
  const [value, setValue] = useState(submission.grade != null ? String(submission.grade) : '')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (value === '') return
    grade.mutate({ historyId: submission.id, grade: Number(value) })
  }

  return (
    <div className="rounded-xl border border-brand-100 bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-medium text-ink">{submission.student?.full_name ?? 'Студент'}</span>
        <span className="text-xs text-ink/50">
          {STATUS_RU[submission.status] ?? submission.status}
          {submission.grade != null ? ` · ${submission.grade}` : ''}
        </span>
      </div>

      <ul className="space-y-2">
        {submission.messages.map((m) => (
          <li key={m.id} className="rounded-lg bg-brand-50/50 px-3 py-2">
            <p className="whitespace-pre-wrap text-sm text-ink/80">{m.message}</p>
            {m.file_path && (
              <a
                href={m.file_path}
                target="_blank"
                rel="noreferrer"
                className="mt-1 inline-block text-xs text-brand-600 hover:underline"
              >
                {m.file_title ?? 'Вложение'}
              </a>
            )}
            <p className="mt-1 text-xs text-ink/40">
              {new Date(m.created_at).toLocaleString('ru-RU')}
            </p>
          </li>
        ))}
      </ul>

      <form onSubmit={submit} className="mt-3 flex items-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Балл"
          className="w-24 rounded-lg border border-brand-200 px-3 py-1.5 text-sm"
        />
        <button
          type="submit"
          disabled={value === '' || grade.isPending}
          className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          {grade.isPending ? '…' : 'Оценить'}
        </button>
        {grade.isError && <span className="text-sm text-red-600">{grade.error.message}</span>}
      </form>
    </div>
  )
}
