import type { ReactNode, SelectHTMLAttributes } from 'react'

const BASE =
  'rounded-lg border border-brand-200 bg-white px-3 py-2 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 disabled:bg-brand-50/50'

// Select matching the Field styling. Pass `label` for a labelled field, or omit
// it for a bare inline select.
export function Select({
  label,
  className = '',
  children,
  ...rest
}: { label?: string; children: ReactNode } & SelectHTMLAttributes<HTMLSelectElement>) {
  const select = (
    <select className={`${BASE} ${className}`} {...rest}>
      {children}
    </select>
  )
  if (!label) return select
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
      {label}
      {select}
    </label>
  )
}
