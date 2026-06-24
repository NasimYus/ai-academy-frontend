import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { CourseCard } from '#/entities/course'
import { favoritesQueryOptions } from '#/entities/favorite'

export function FavoritesPage() {
  const favorites = useQuery(favoritesQueryOptions)

  if (favorites.isPending)
    return <p className="mx-auto max-w-5xl px-6 py-8 text-ink/60">Загрузка…</p>
  if (favorites.isError)
    return <p className="mx-auto max-w-5xl px-6 py-8 text-red-600">{favorites.error.message}</p>

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-ink">Избранное</h1>

      {favorites.data.length === 0 ? (
        <p className="text-ink/60">
          В избранном пусто.{' '}
          <Link to="/courses" className="text-brand-600 hover:underline">
            К каталогу
          </Link>
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.data.map((f) => (
            <CourseCard key={f.id} course={f.course} />
          ))}
        </div>
      )}
    </div>
  )
}
