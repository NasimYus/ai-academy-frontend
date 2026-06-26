import type { TextareaHTMLAttributes } from 'react'

// Labelled textarea matching the Field styling.
export function Textarea({
  label,
  className = '',
  ...rest
}: { label: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
      {label}
      <textarea
        className={`rounded-lg border border-brand-200 px-3 py-2 font-normal text-ink outline-none transition placeholder:text-ink/35 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 ${className}`}
        {...rest}
      />
    </label>
  )
}
