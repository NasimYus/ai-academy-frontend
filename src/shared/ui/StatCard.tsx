import type { ReactNode } from 'react'

export function StatCard({
  label,
  value,
  icon,
}: {
  label: string
  value: ReactNode
  icon?: ReactNode
}) {
  return (
    <div className="rounded-xl border border-brand-100 bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink/55">{label}</span>
        {icon && <span className="text-brand-400">{icon}</span>}
      </div>
      <p className="mt-2 text-2xl font-bold text-ink">{value}</p>
    </div>
  )
}
