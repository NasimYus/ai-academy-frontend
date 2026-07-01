import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { MessageCircle } from 'lucide-react'

import { myPostsQueryOptions, myTopicsQueryOptions } from '#/entities/community-forum'
import { EmptyState, PageHeader, Spinner } from '#/shared/ui'

const fmt = (iso: string) => new Intl.DateTimeFormat('ru-RU', { dateStyle: 'medium' }).format(new Date(iso))

export function MyForumTopicsPage() {
  const { data, isPending, isError, error } = useQuery(myTopicsQueryOptions)

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <PageHeader title="Мои темы" subtitle="Темы, которые вы создали." />
      {isPending && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}
      {isError && <p className="text-red-600">{error.message}</p>}
      {data && data.length === 0 && (
        <EmptyState icon="💬">
          <p className="font-semibold text-ink">Вы ещё не создавали темы</p>
        </EmptyState>
      )}
      <div className="mt-4 space-y-2">
        {data?.map((t) => (
          <Link
            key={t.id}
            to="/forum-topics/$slug"
            params={{ slug: t.slug }}
            className="flex items-center justify-between gap-3 rounded-2xl border border-brand-100 p-4 transition hover:border-brand-300 hover:bg-brand-50/40"
          >
            <div className="min-w-0">
              <p className="truncate font-bold text-ink">{t.title}</p>
              <p className="text-xs text-ink/50">{fmt(t.created_at)}</p>
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

export function MyForumPostsPage() {
  const { data, isPending, isError, error } = useQuery(myPostsQueryOptions)

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <PageHeader title="Мои посты" subtitle="Ваши ответы в обсуждениях." />
      {isPending && (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      )}
      {isError && <p className="text-red-600">{error.message}</p>}
      {data && data.length === 0 && (
        <EmptyState icon="✍️">
          <p className="font-semibold text-ink">Вы ещё не оставляли ответов</p>
        </EmptyState>
      )}
      <div className="mt-4 space-y-2">
        {data?.map((p) => (
          <Link
            key={p.id}
            to="/forum-topics/$slug"
            params={{ slug: p.topic_slug }}
            className="block rounded-2xl border border-brand-100 p-4 transition hover:border-brand-300 hover:bg-brand-50/40"
          >
            <p className="text-xs font-medium text-brand-600">{p.topic_title}</p>
            <p className="mt-1 line-clamp-2 text-sm text-ink/80">{p.description}</p>
            <p className="mt-1 text-xs text-ink/40">{fmt(p.created_at)}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
