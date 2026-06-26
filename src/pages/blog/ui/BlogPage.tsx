import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { MessageSquare } from 'lucide-react'

import { blogCategoriesQueryOptions, blogListQueryOptions } from '#/entities/blog'
import type { BlogBrief } from '#/entities/blog'

function BlogCard({ post }: { post: BlogBrief }) {
  return (
    <Link
      to="/blog/$blogId"
      params={{ blogId: String(post.id) }}
      className="flex flex-col overflow-hidden rounded-xl border border-brand-100 bg-white transition hover:border-brand-300"
    >
      {post.image && (
        <img src={post.image} alt={post.title} className="h-40 w-full object-cover" />
      )}
      <div className="flex flex-1 flex-col p-4">
        {post.category && (
          <span className="mb-1 text-xs font-medium text-brand-600">{post.category}</span>
        )}
        <h3 className="font-semibold text-ink">{post.title}</h3>
        <p className="mt-1 line-clamp-3 flex-1 text-sm text-ink/60">{post.description}</p>
        <div className="mt-3 flex items-center justify-between text-xs text-ink/40">
          <span>{post.author?.full_name ?? 'Автор'}</span>
          <span className="inline-flex items-center gap-1">
            <MessageSquare className="size-3.5" strokeWidth={1.8} />
            {post.comment_count}
          </span>
        </div>
      </div>
    </Link>
  )
}

export function BlogPage() {
  const [category, setCategory] = useState<number | undefined>(undefined)
  const categories = useQuery(blogCategoriesQueryOptions)
  const posts = useQuery(blogListQueryOptions(category))

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-ink">Блог</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory(undefined)}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
            category === undefined
              ? 'bg-brand-600 text-white'
              : 'border border-brand-200 text-brand-700 hover:bg-brand-50'
          }`}
        >
          Все
        </button>
        {(categories.data ?? []).map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
              category === c.id
                ? 'bg-brand-600 text-white'
                : 'border border-brand-200 text-brand-700 hover:bg-brand-50'
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      {posts.isPending ? (
        <p className="text-ink/60">Загрузка…</p>
      ) : posts.isError ? (
        <p className="text-red-600">{posts.error.message}</p>
      ) : posts.data.blogs.length === 0 ? (
        <p className="text-ink/60">Пока нет статей.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.data.blogs.map((p) => (
            <BlogCard key={p.id} post={p} />
          ))}
        </div>
      )}
    </div>
  )
}
