import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { CommentReply, classCommentsQueryOptions } from '#/features/class-comments'
import type { ClassComment } from '#/features/class-comments'

function CommentCard({ comment }: { comment: ClassComment }) {
  return (
    <li className="rounded-xl border border-brand-100 bg-white p-4">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium text-ink">
          {comment.user?.full_name ?? 'Пользователь'}
        </span>
        <span className="text-xs text-ink/40">
          {new Date(comment.created_at).toLocaleDateString('ru-RU')}
        </span>
      </div>
      <p className="whitespace-pre-wrap text-sm text-ink/80">{comment.comment}</p>

      {comment.replies.length > 0 && (
        <ul className="mt-3 space-y-3 border-l-2 border-brand-100 pl-4">
          {comment.replies.map((r) => (
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

      <div className="mt-2">
        <CommentReply commentId={comment.id} />
      </div>
    </li>
  )
}

export function InstructorCommentsPage() {
  const { data, isPending, isError, error } = useQuery(classCommentsQueryOptions)

  if (isPending) return <p className="mx-auto max-w-3xl px-6 py-8 text-ink/60">Загрузка…</p>
  if (isError) return <p className="mx-auto max-w-3xl px-6 py-8 text-red-600">{error.message}</p>

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Комментарии к курсам</h1>
        <Link to="/instructor" className="text-sm text-brand-600 hover:underline">
          ← К курсам
        </Link>
      </div>

      {data.length === 0 ? (
        <p className="text-ink/60">Комментариев пока нет.</p>
      ) : (
        <ul className="space-y-3">
          {data.map((c) => (
            <CommentCard key={c.id} comment={c} />
          ))}
        </ul>
      )}
    </div>
  )
}
