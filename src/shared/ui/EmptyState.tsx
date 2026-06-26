import type { ReactNode } from 'react'

export function EmptyState({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-brand-200 bg-brand-50/40 px-6 py-12 text-center text-ink/55">
      {icon && <div className="mb-2 text-3xl">{icon}</div>}
      {children}
    </div>
  )
}
