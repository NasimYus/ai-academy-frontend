import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import { forumAnswersQueryOptions } from '#/entities/forum'
import type { ForumThread } from '#/entities/forum'
import {
  useCreateAnswer,
  useResolveAnswer,
  useToggleAnswerPin,
  useToggleThreadPin,
} from '#/features/course-forum/model/use-forum'

export function ThreadCard({ courseId, thread }: { courseId: number; thread: ForumThread }) {
  const [open, setOpen] = useState(false)
  const [answer, setAnswer] = useState('')
  const answers = useQuery({ ...forumAnswersQueryOptions(thread.id), enabled: open })

  const pinThread = useToggleThreadPin(courseId)
  const createAnswer = useCreateAnswer(courseId, thread.id)
  const pinAnswer = useToggleAnswerPin(thread.id)
  const resolve = useResolveAnswer(courseId, thread.id)

  return (
    <div className="rounded-lg border border-brand-100 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-ink">
            {thread.pin && <span className="mr-1">📌</span>}
            {thread.resolved && <span className="mr-1 text-emerald-600">✓</span>}
            {thread.title}
          </p>
          <p className="mt-1 whitespace-pre-line text-sm text-ink/70">{thread.description}</p>
          <p className="mt-1 text-xs text-ink/40">
            {thread.user?.full_name} · ответов: {thread.answers_count}
          </p>
        </div>
        {thread.can.pin && (
          <button
            onClick={() => pinThread.mutate(thread.id)}
            disabled={pinThread.isPending}
            className="shrink-0 text-xs text-brand-600 hover:underline"
          >
            {thread.pin ? 'Открепить' : 'Закрепить'}
          </button>
        )}
      </div>

      <button onClick={() => setOpen((o) => !o)} className="mt-2 text-xs text-brand-600 hover:underline">
        {open ? 'Скрыть ответы' : 'Показать ответы'}
      </button>

      {open && (
        <div className="mt-3 space-y-2 border-t border-brand-50 pt-3">
          {answers.data?.map((a) => (
            <div key={a.id} className="rounded border border-brand-50 bg-brand-50/30 p-2 text-sm">
              <p className="whitespace-pre-line text-ink/80">
                {a.pin && <span className="mr-1">📌</span>}
                {a.resolved && <span className="mr-1 text-emerald-600">✓</span>}
                {a.description}
              </p>
              <div className="mt-1 flex items-center gap-3 text-xs text-ink/40">
                <span>{a.user?.full_name}</span>
                {a.can.resolve && (
                  <button
                    onClick={() => resolve.mutate(a.id)}
                    disabled={resolve.isPending}
                    className="text-brand-600 hover:underline"
                  >
                    {a.resolved ? 'Снять решение' : 'Отметить решением'}
                  </button>
                )}
                {a.can.pin && (
                  <button
                    onClick={() => pinAnswer.mutate(a.id)}
                    disabled={pinAnswer.isPending}
                    className="text-brand-600 hover:underline"
                  >
                    {a.pin ? 'Открепить' : 'Закрепить'}
                  </button>
                )}
              </div>
            </div>
          ))}

          <div className="flex gap-2">
            <input
              className="flex-1 rounded border border-brand-200 p-2 text-sm"
              placeholder="Ваш ответ…"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
            <button
              onClick={() => createAnswer.mutate(answer, { onSuccess: () => setAnswer('') })}
              disabled={createAnswer.isPending || answer.trim() === ''}
              className="rounded bg-brand-600 px-3 py-1 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50"
            >
              Ответить
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
