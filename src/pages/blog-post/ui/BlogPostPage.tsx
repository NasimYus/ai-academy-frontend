import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { blogQueryOptions } from '#/entities/blog'
import { BlogCommentForm } from '#/features/blog-comment'

export function BlogPostPage({ blogId }: { blogId: number }) {
  const { data, isPending, isError, error } = useQuery(blogQueryOptions(blogId))

  if (isPending) return <p className="mx-auto max-w-3xl px-6 py-8 text-ink/60">Загрузка…</p>
  if (isError) return <p className="mx-auto max-w-3xl px-6 py-8 text-red-600">{error.message}</p>

  return (
    <article className="mx-auto max-w-3xl px-6 py-8">
      <Link to="/blog" className="mb-4 inline-block text-sm text-brand-600 hover:underline">
        ← К блогу
      </Link>

      {data.category && (
        <span className="text-xs font-medium text-brand-600">{data.category}</span>
      )}
      <h1 className="mt-1 text-3xl font-bold text-ink">{data.title}</h1>
      <div className="mt-2 flex items-center gap-2 text-sm text-ink/50">
        <span>{data.author?.full_name ?? 'Автор'}</span>
        <span>·</span>
        <span>{new Date(data.created_at).toLocaleDateString('ru-RU')}</span>
      </div>

      {data.image && (
        <img src={data.image} alt={data.title} className="mt-6 w-full rounded-xl object-cover" />
      )}

      <div className="prose mt-6 max-w-none whitespace-pre-wrap text-ink/80">{data.content}</div>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-ink">
          Комментарии ({data.comment_count})
        </h2>

        <div className="mb-6">
          <BlogCommentForm blogId={blogId} />
        </div>

        {data.comments.length === 0 ? (
          <p className="text-sm text-ink/50">Комментариев пока нет.</p>
        ) : (
          <ul className="space-y-4">
            {data.comments.map((c) => (
              <li key={c.id} className="rounded-xl border border-brand-100 bg-white p-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-medium text-ink">
                    {c.user?.full_name ?? 'Пользователь'}
                  </span>
                  <span className="text-xs text-ink/40">
                    {new Date(c.created_at).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm text-ink/80">{c.comment}</p>

                {c.replies.length > 0 && (
                  <ul className="mt-3 space-y-3 border-l-2 border-brand-100 pl-4">
                    {c.replies.map((r) => (
                      <li key={r.id}>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium text-ink">
                            {r.user?.full_name ?? 'Пользователь'}
                          </span>
                          <span className="text-xs text-ink/40">
                            {new Date(r.created_at).toLocaleDateString('ru-RU')}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap text-sm text-ink/80">{r.comment}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  )
}
