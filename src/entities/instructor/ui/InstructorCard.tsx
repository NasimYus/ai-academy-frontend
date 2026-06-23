import { Link } from '@tanstack/react-router'

import type { Provider } from '#/entities/instructor/model/types'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export function InstructorCard({ provider }: { provider: Provider }) {
  const avatarUrl = provider.avatar ? `${API_URL}${provider.avatar}` : null

  return (
    <Link
      to="/users/$userId"
      params={{ userId: String(provider.id) }}
      className="flex items-center gap-3 rounded-card border border-brand-100 bg-white p-4 shadow-sm transition hover:border-brand-300 hover:shadow-md"
    >
      <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-brand-100 bg-brand-50 text-ink/40">
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="size-full object-cover" />
        ) : (
          <span className="text-sm font-semibold text-brand-700">
            {provider.full_name?.[0] ?? '?'}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate font-medium text-ink">{provider.full_name ?? 'Без имени'}</p>
        {provider.headline && (
          <p className="truncate text-sm text-ink/60">{provider.headline}</p>
        )}
      </div>
    </Link>
  )
}
