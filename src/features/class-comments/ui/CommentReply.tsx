import { useState } from 'react'

import { useReplyComment } from '#/features/class-comments/model/use-reply'

/** Inline reply box for a class comment. */
export function CommentReply({ commentId }: { commentId: number }) {
  const reply = useReplyComment()
  const [text, setText] = useState('')
  const [open, setOpen] = useState(false)

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-brand-600 hover:underline"
      >
        Ответить
      </button>
    )
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (text.trim().length < 1) return
    reply.mutate(
      { commentId, reply: text },
      {
        onSuccess: () => {
          setText('')
          setOpen(false)
        },
      },
    )
  }

  return (
    <form onSubmit={submit} className="mt-2 space-y-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ваш ответ…"
        rows={2}
        className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm"
      />
      {reply.isError && <p className="text-sm text-red-600">{reply.error.message}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={text.trim().length < 1 || reply.isPending}
          className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          {reply.isPending ? '…' : 'Отправить'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-lg border border-brand-200 px-3 py-1.5 text-sm text-ink/60"
        >
          Отмена
        </button>
      </div>
    </form>
  )
}
