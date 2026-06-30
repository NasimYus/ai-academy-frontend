import type { ReactNode } from 'react'

// Toggle switch matching the brand. Controlled via `checked`/`onChange`.
export function Switch({
  checked,
  onChange,
  label,
  hint,
  disabled,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: ReactNode
  hint?: ReactNode
  disabled?: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-ink">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => onChange(!checked)}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition disabled:opacity-50 ${
            checked ? 'bg-brand-600' : 'bg-brand-100'
          }`}
        >
          <span
            className={`inline-block size-5 rounded-full bg-white shadow transition ${
              checked ? 'translate-x-[22px]' : 'translate-x-0.5'
            }`}
          />
        </button>
        {label}
      </label>
      {hint && <p className="pl-14 text-xs text-ink/50">{hint}</p>}
    </div>
  )
}
