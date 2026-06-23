import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { assignmentMessagesQueryOptions, assignmentQueryOptions } from '#/entities/assignment'
import type { AssignmentMessage } from '#/entities/assignment'
import { SubmitAssignmentForm } from '#/features/submit-assignment'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

function Message({ msg }: { msg: AssignmentMessage }) {
  const who = msg.sender ?? msg.supporter
  const mine = msg.sender != null
  return (
    <div
      className={`rounded-lg border p-3 ${
        mine ? 'border-brand-200 bg-brand-50' : 'border-brand-100 bg-white'
      }`}
    >
      <div className="mb-1 flex items-center justify-between text-xs text-ink/50">
        <span>{who?.full_name ?? 'Пользователь'}</span>
        <span>{new Date(msg.created_at).toLocaleString('ru')}</span>
      </div>
      <p className="whitespace-pre-line text-sm text-ink/90">{msg.message}</p>
      {msg.file_path && (
        <a
          href={`${API_URL}${msg.file_path}`}
          target="_blank"
          rel="noreferrer"
          className="mt-1 inline-block text-sm text-brand-600 hover:underline"
        >
          {msg.file_title || 'Вложение'}
        </a>
      )}
    </div>
  )
}

export function AssignmentPage({ assignmentId, slug }: { assignmentId: number; slug?: string }) {
  const assignment = useQuery(assignmentQueryOptions(assignmentId))
  const messages = useQuery(assignmentMessagesQueryOptions(assignmentId))

  if (assignment.isPending)
    return <p className="mx-auto max-w-3xl px-6 py-8 text-ink/60">Загрузка…</p>
  if (assignment.isError)
    return <p className="mx-auto max-w-3xl px-6 py-8 text-red-600">{assignment.error.message}</p>

  const a = assignment.data

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-6">
        {slug ? (
          <Link to="/learn/$slug" params={{ slug }} className="text-sm text-brand-600 hover:underline">
            ← К обучению
          </Link>
        ) : (
          <Link to="/courses" className="text-sm text-brand-600 hover:underline">
            ← К курсам
          </Link>
        )}
      </div>

      <h1 className="text-2xl font-bold text-ink">{a.title}</h1>
      <p className="mt-1 text-sm text-ink/60">
        Макс. балл: {a.total_grade ?? '—'} · проходной: {a.pass_grade ?? '—'}
        {a.attempts != null && ` · попыток: ${a.attempts}`}
      </p>
      {a.description && <p className="mt-3 whitespace-pre-line text-ink/80">{a.description}</p>}

      <section className="mt-6">
        <h2 className="mb-2 font-display text-lg font-bold text-ink">Моя работа</h2>
        <div className="mb-4 space-y-2">
          {messages.data && messages.data.length > 0 ? (
            messages.data.map((m) => <Message key={m.id} msg={m} />)
          ) : (
            <p className="text-sm text-ink/50">Вы ещё не отправляли работу.</p>
          )}
        </div>
        <SubmitAssignmentForm assignmentId={assignmentId} />
      </section>
    </div>
  )
}
