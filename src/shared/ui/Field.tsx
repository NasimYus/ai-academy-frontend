import type { InputHTMLAttributes } from 'react'

// Labelled text input with the shared field styling used across forms.
export function Field({
  label,
  className = '',
  ...rest
}: { label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
      {label}
      <input
        className={`rounded-lg border border-brand-200 px-3 py-2 font-normal text-ink outline-none transition placeholder:text-ink/35 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 disabled:bg-brand-50/50 ${className}`}
        {...rest}
      />
    </label>
  )
}
