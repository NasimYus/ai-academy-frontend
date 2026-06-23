import { useQuery } from '@tanstack/react-query'

import { CourseCard } from '#/entities/course'
import { publicProfileQueryOptions } from '#/entities/instructor'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export function UserProfilePage({ userId }: { userId: number }) {
  const profile = useQuery(publicProfileQueryOptions(userId))

  if (profile.isPending) return <p className="p-8 text-ink/60">Загрузка…</p>
  if (profile.isError) return <p className="p-8 text-red-600">{profile.error.message}</p>

  const user = profile.data
  const avatarUrl = user.avatar ? `${API_URL}${user.avatar}` : null

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <header className="mb-8 flex items-center gap-4">
        <div className="flex size-20 items-center justify-center overflow-hidden rounded-full border border-brand-100 bg-brand-50 text-ink/40">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="size-full object-cover" />
          ) : (
            <span className="text-2xl font-semibold text-brand-700">
              {user.full_name?.[0] ?? '?'}
            </span>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-ink">{user.full_name ?? 'Без имени'}</h1>
          {user.headline && <p className="text-ink/60">{user.headline}</p>}
          {user.bio && <p className="mt-1 text-sm text-ink/50">{user.bio}</p>}
        </div>
      </header>

      {user.about && <p className="mb-8 whitespace-pre-line text-ink/80">{user.about}</p>}

      <h2 className="mb-4 font-display text-lg font-bold text-ink">
        Курсы ({user.courses_count})
      </h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {user.courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}
