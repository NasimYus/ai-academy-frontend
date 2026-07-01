import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { MessageCircle, Pin } from 'lucide-react'

import { forumTopicsQueryOptions } from '#/entities/community-forum'
import { Avatar, EmptyState, Spinner } from '#/shared/ui'

const fmt = (iso: string) => new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium' }).format(new Date(iso))

export function ForumCategoryPage({ forumId }: { forumId: number }) {
  const { data, isPending, isError, error } = useQuery(forumTopicsQueryOptions(forumId))

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <div className="mb-5 flex items-center justify-between">
        <Link to="/forums" className="text-sm text-brand-600 hover:underline">
          ← Ко всем форумам
        </Link>
        <Link
          to="/forums/create-topic"
          className="text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          + Новая тема
        </Link>
      </div>

      {isPending && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}
      {isError && <p className="text-red-600">{error.message}</p>}
      {data && data.length === 0 && (
        <EmptyState icon="💬">
          <p className="font-semibold text-ink">В этом форуме пока нет тем</p>
          <p className="mt-1 text-sm">Создайте первую тему.</p>
        </EmptyState>
      )}

      <div className="space-y-2">
        {data?.map((t) => (
          <Link
            key={t.id}
            to="/forum-topics/$slug"
            params={{ slug: t.slug }}
            className="flex items-center justify-between gap-3 rounded-2xl border border-brand-100 p-4 transition hover:border-brand-300 hover:bg-brand-50/40"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Avatar name={t.author?.full_name ?? '?'} size={38} />
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 truncate font-bold text-ink">
                  {t.pin && <Pin className="size-3.5 shrink-0 text-brand-500" />}
                  {t.title}
                </p>
                <p className="text-xs text-ink/50">
                  {t.author?.full_name ?? '—'} · {fmt(t.created_at)}
                </p>
              </div>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-sm text-ink/50">
              <MessageCircle className="size-4" /> {t.posts_count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
