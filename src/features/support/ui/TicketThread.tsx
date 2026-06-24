import { useState } from 'react'

import type { SupportDetail } from '#/entities/support'

import {
  useCloseTicket,
  useReplyTicket,
} from '#/features/support/model/use-support'

const STATUS_LABEL: Record<string, string> = {
  open: 'Открыто',
  replied: 'Есть ответ',
  supporter_replied: 'Ответ поддержки',
  close: 'Закрыто',
}

/** Conversation thread for a ticket, with a reply box and a close action. */
export function TicketThread({ ticket }: { ticket: SupportDetail }) {
  const reply = useReplyTicket(ticket.id)
  const close = useCloseTicket(ticket.id)
  const [message, setMessage] = useState('')
  const [attachment, setAttachment] = useState<File | null>(null)
  const closed = ticket.status === 'close'

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (message.trim().length < 2) return
    reply.mutate(
      { message, attachment },
      {
        onSuccess: () => {
          setMessage('')
          setAttachment(null)
        },
      },
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">{ticket.title}</h1>
          <p className="text-sm text-ink/50">
            {ticket.type === 'course_support'
              ? (ticket.course?.title ?? 'Курс')
              : (ticket.department ?? 'Платформа')}{' '}
            · {STATUS_LABEL[ticket.status] ?? ticket.status}
          </p>
        </div>
        {!closed && (
          <button
            type="button"
            onClick={() => close.mutate()}
            disabled={close.isPending}
            className="rounded-lg border border-brand-200 px-3 py-1.5 text-sm font-medium text-brand-700 transition hover:bg-brand-50 disabled:opacity-50"
          >
            Закрыть
          </button>
        )}
      </div>

      <ul className="space-y-3">
        {ticket.conversations.map((c, i) => (
          <li
            key={i}
            className="rounded-xl border border-brand-100 bg-white p-4"
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-medium text-ink">
                {c.supporter?.full_name ??
                  c.sender?.full_name ??
                  'Пользователь'}
                {c.supporter && (
                  <span className="ml-1 text-xs text-brand-600">
                    (поддержка)
                  </span>
                )}
              </span>
              <span className="text-xs text-ink/40">
                {new Date(c.created_at).toLocaleString('ru-RU')}
              </span>
            </div>
            <p className="whitespace-pre-wrap text-sm text-ink/80">
              {c.message}
            </p>
            {c.attach && (
              <a
                href={c.attach}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-xs text-brand-600 hover:underline"
              >
                Вложение
              </a>
            )}
          </li>
        ))}
      </ul>

      {closed ? (
        <p className="text-sm text-ink/50">Обращение закрыто.</p>
      ) : (
        <form
          onSubmit={submit}
          className="space-y-2 rounded-xl border border-brand-100 bg-white p-4"
        >
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ваш ответ…"
            rows={3}
            className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm"
          />
          <input
            type="file"
            onChange={(e) => setAttachment(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-ink/60"
          />
          {reply.isError && (
            <p className="text-sm text-red-600">{reply.error.message}</p>
          )}
          <button
            type="submit"
            disabled={message.trim().length < 2 || reply.isPending}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
          >
            {reply.isPending ? 'Отправка…' : 'Ответить'}
          </button>
        </form>
      )}
    </div>
  )
}
