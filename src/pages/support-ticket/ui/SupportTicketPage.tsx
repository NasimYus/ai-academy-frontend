import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { supportDetailQueryOptions } from '#/entities/support'
import { TicketThread } from '#/features/support'

export function SupportTicketPage({ supportId }: { supportId: number }) {
  const { data, isPending, isError, error } = useQuery(
    supportDetailQueryOptions(supportId),
  )

  if (isPending)
    return <p className="mx-auto max-w-3xl px-6 py-8 text-ink/60">Загрузка…</p>
  if (isError)
    return (
      <p className="mx-auto max-w-3xl px-6 py-8 text-red-600">
        {error.message}
      </p>
    )

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <Link
        to="/support"
        className="mb-4 inline-block text-sm text-brand-600 hover:underline"
      >
        ← К обращениям
      </Link>
      <TicketThread ticket={data} />
    </div>
  )
}
