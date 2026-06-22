import { createFileRoute, redirect } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

import { api } from '#/lib/api'
import { useAuthStore } from '#/stores/auth'

export const Route = createFileRoute('/courses')({
  beforeLoad: () => {
    if (!useAuthStore.getState().token) {
      throw redirect({ to: '/login' })
    }
  },
  component: CoursesPage,
})

function CoursesPage() {
  const courses = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/courses', {})
      if (error || !data) throw new Error('Не удалось загрузить курсы')
      return data
    },
  })

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-ink">Курсы</h1>

      {courses.isPending && <p className="text-ink/60">Загрузка…</p>}
      {courses.isError && <p className="text-red-600">{(courses.error as Error).message}</p>}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {courses.data?.map((c) => (
          <article
            key={c.id}
            className="flex flex-col rounded-card border border-brand-100 bg-white p-5 shadow-sm transition hover:border-brand-300 hover:shadow-md"
          >
            <h2 className="font-display text-lg font-bold text-ink">{c.title}</h2>
            <p className="mt-2 flex-1 text-sm text-ink/60">{c.description}</p>
            <div className="mt-4">
              {Number(c.price) === 0 ? (
                <span className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
                  Бесплатно
                </span>
              ) : (
                <span className="inline-flex rounded-full bg-brand-500 px-3 py-1 text-sm font-semibold text-white">
                  {c.price} TJS
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
