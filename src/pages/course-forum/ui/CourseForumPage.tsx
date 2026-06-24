import { useQuery } from '@tanstack/react-query'

import { courseForumsQueryOptions } from '#/entities/forum'
import { NewThreadForm, ThreadCard } from '#/features/course-forum'

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-brand-100 bg-white px-3 py-2 text-center">
      <div className="text-lg font-bold text-ink">{value}</div>
      <div className="text-xs text-ink/50">{label}</div>
    </div>
  )
}

export function CourseForumPage({ courseId }: { courseId: number }) {
  const forum = useQuery(courseForumsQueryOptions(courseId))

  if (forum.isPending) return <p className="mx-auto max-w-3xl px-6 py-8 text-ink/60">Загрузка…</p>
  if (forum.isError)
    return <p className="mx-auto max-w-3xl px-6 py-8 text-red-600">{forum.error.message}</p>

  const data = forum.data

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-6 py-8">
      <h1 className="text-2xl font-bold text-ink">Форум курса</h1>

      <div className="grid grid-cols-4 gap-2">
        <Stat label="Вопросов" value={data.questions_count} />
        <Stat label="Решено" value={data.resolved_count} />
        <Stat label="Открыто" value={data.open_questions_count} />
        <Stat label="Участников" value={data.active_users_count} />
      </div>

      <NewThreadForm courseId={courseId} />

      {data.forums.length === 0 ? (
        <p className="text-ink/60">Пока нет вопросов — задайте первый.</p>
      ) : (
        <div className="space-y-2">
          {data.forums.map((thread) => (
            <ThreadCard key={thread.id} courseId={courseId} thread={thread} />
          ))}
        </div>
      )}
    </div>
  )
}
