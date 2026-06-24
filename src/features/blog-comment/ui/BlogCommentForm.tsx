import { useState } from 'react'

import { useSessionStore } from '#/entities/session'

import { usePostBlogComment } from '#/features/blog-comment/model/use-comment'

/** Comment box for a blog post (anonymous users are prompted to sign in). */
export function BlogCommentForm({ blogId }: { blogId: number }) {
  const token = useSessionStore((s) => s.token)
  const post = usePostBlogComment(blogId)
  const [comment, setComment] = useState('')

  if (!token) {
    return <p className="text-sm text-ink/50">Войдите, чтобы оставить комментарий.</p>
  }

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (comment.trim().length < 1) return
    post.mutate({ comment }, { onSuccess: () => setComment('') })
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Ваш комментарий…"
        rows={3}
        className="w-full rounded-lg border border-brand-200 px-3 py-2 text-sm"
      />
      {post.isError && <p className="text-sm text-red-600">{post.error.message}</p>}
      <button
        type="submit"
        disabled={comment.trim().length < 1 || post.isPending}
        className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
      >
        {post.isPending ? 'Отправка…' : 'Отправить'}
      </button>
    </form>
  )
}
