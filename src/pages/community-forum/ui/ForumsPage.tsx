import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { MessagesSquare, Plus } from 'lucide-react'

import { forumCategoriesQueryOptions } from '#/entities/community-forum'
import { Button, EmptyState, PageHeader, Spinner } from '#/shared/ui'

export function ForumsPage() {
  const { data, isPending, isError, error } = useQuery(forumCategoriesQueryOptions)

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <div className="mb-5 flex items-center justify-between">
        <PageHeader title="Форумы" subtitle="Обсуждения сообщества по темам." />
        <Link to="/forums/create-topic">
          <Button className="gap-2">
            <Plus className="size-4" /> Новая тема
          </Button>
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
          <p className="font-semibold text-ink">Форумов пока нет</p>
        </EmptyState>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {data?.map((cat) => (
          <Link
            key={cat.id}
            to="/forums/$forumId"
            params={{ forumId: String(cat.id) }}
            className="flex items-start gap-3 rounded-2xl border border-brand-100 p-4 transition hover:border-brand-300 hover:bg-brand-50/40"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
              <MessagesSquare className="size-5" strokeWidth={1.8} />
            </span>
            <div className="min-w-0">
              <p className="font-bold text-ink">{cat.title}</p>
              {cat.description && <p className="mt-0.5 text-sm text-ink/55">{cat.description}</p>}
              <p className="mt-1 text-xs text-ink/40">{cat.topics_count} тем</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
