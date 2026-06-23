import { useQuery } from '@tanstack/react-query'

import { InstructorCard, instructorsQueryOptions } from '#/entities/instructor'

export function InstructorsPage() {
  const instructors = useQuery(instructorsQueryOptions())

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-ink">Преподаватели</h1>

      {instructors.isPending && <p className="text-ink/60">Загрузка…</p>}
      {instructors.isError && <p className="text-red-600">{instructors.error.message}</p>}
      {instructors.data && instructors.data.length === 0 && (
        <p className="text-ink/60">Пока нет преподавателей.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {instructors.data?.map((provider) => (
          <InstructorCard key={provider.id} provider={provider} />
        ))}
      </div>
    </div>
  )
}
