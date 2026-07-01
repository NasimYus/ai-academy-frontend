import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { forumTopicQueryOptions } from '#/entities/community-forum'
import { useReplyToTopic } from '#/features/manage-forum'
import { useSessionStore } from '#/entities/session'
import { Avatar, Button, Spinner, Textarea } from '#/shared/ui'

const fmt = (iso: string) =>
  new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))

export function ForumTopicPage({ slug }: { slug: string }) {
  const { data, isPending, isError, error } = useQuery(forumTopicQueryOptions(slug))
  const token = useSessionStore((s) => s.token)
  const reply = useReplyToTopic(slug)
  const [text, setText] = useState('')

  if (isPending)
    return (
      <div className="flex justify-center py-20">
        <Spinner />
      </div>
    )
  if (isError) return <p className="mx-auto max-w-3xl px-6 py-8 text-red-600">{error.message}</p>

  const send = () => {
    if (!text.trim()) return
    reply.mutate({ topicId: data.id, description: text.trim() }, { onSuccess: () => setText('') })
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <Link
        to="/forums/$forumId"
        params={{ forumId: String(data.forum_id) }}
        className="text-sm text-brand-600 hover:underline"
      >
        ← К темам
      </Link>

      {/* Topic head */}
      <div className="mt-4 rounded-2xl border border-brand-100 p-5">
        <h1 className="font-display text-2xl font-bold text-ink">{data.title}</h1>
        <div className="mt-2 flex items-center gap-2 text-xs text-ink/50">
          <Avatar name={data.author?.full_name ?? '?'} size={24} />
          {data.author?.full_name ?? '—'} · {fmt(data.created_at)}
        </div>
        <p className="mt-4 whitespace-pre-wrap text-sm text-ink/80">{data.description}</p>
      </div>

      {/* Posts */}
      <h2 className="mt-6 mb-3 text-sm font-bold text-ink">Ответы ({data.posts.length})</h2>
      <div className="space-y-3">
        {data.posts.map((p) => (
          <div key={p.id} className="rounded-2xl border border-brand-100 p-4">
            <div className="flex items-center gap-2 text-xs text-ink/50">
              <Avatar name={p.author?.full_name ?? '?'} size={24} />
              {p.author?.full_name ?? '—'} · {fmt(p.created_at)}
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm text-ink/80">{p.description}</p>
          </div>
        ))}
      </div>

      {/* Reply */}
      {token ? (
        !data.close ? (
          <div className="mt-6 space-y-2">
            <Textarea
              label="Ваш ответ"
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Напишите ответ…"
            />
            {reply.isError && <p className="text-sm text-red-600">{reply.error.message}</p>}
            <Button onClick={send} disabled={reply.isPending || !text.trim()}>
              {reply.isPending ? 'Отправка…' : 'Ответить'}
            </Button>
          </div>
        ) : (
          <p className="mt-6 rounded-xl border border-brand-100 bg-brand-50/40 px-4 py-3 text-sm text-ink/55">
            Тема закрыта для новых ответов.
          </p>
        )
      ) : (
        <p className="mt-6 text-sm text-ink/55">
          <Link to="/login" className="text-brand-600 hover:underline">
            Войдите
          </Link>
          , чтобы ответить.
        </p>
      )}
    </div>
  )
}
