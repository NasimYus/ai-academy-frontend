import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
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
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const courses = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/courses', {})
      if (error || !data) throw new Error('Не удалось загрузить курсы')
      return data
    },
  })

  return (
    <div className="mx-auto max-w-4xl p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Курсы</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gray-600">{user?.email}</span>
          <button
            onClick={() => {
              logout()
              navigate({ to: '/login' })
            }}
            className="rounded border border-gray-300 px-3 py-1"
          >
            Выйти
          </button>
        </div>
      </header>

      {courses.isPending && <p>Загрузка…</p>}
      {courses.isError && <p className="text-red-600">{(courses.error as Error).message}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        {courses.data?.map((c) => (
          <article key={c.id} className="rounded border border-gray-200 p-4">
            <h2 className="font-medium">{c.title}</h2>
            <p className="mt-1 text-sm text-gray-600">{c.description}</p>
            <p className="mt-3 text-sm font-semibold">
              {Number(c.price) === 0 ? 'Бесплатно' : `${c.price} TJS`}
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}
