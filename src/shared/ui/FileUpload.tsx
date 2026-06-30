import { useRef } from 'react'
import { ImagePlus, Loader2, X } from 'lucide-react'

// Presentational upload box: previews an image `value` (a stored URL) and emits
// the picked File via `onSelect`. The actual upload lives in the feature layer.
export function FileUpload({
  label,
  value,
  onSelect,
  onClear,
  uploading = false,
  accept = 'image/*',
  className = '',
}: {
  label: string
  value?: string | null
  onSelect: (file: File) => void
  onClear?: () => void
  uploading?: boolean
  accept?: string
  className?: string
}) {
  const ref = useRef<HTMLInputElement>(null)
  const base = (import.meta.env.VITE_API_URL as string | undefined) ?? ''
  const src = value ? (value.startsWith('http') ? value : `${base}${value}`) : null

  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        disabled={uploading}
        className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-dashed border-brand-200 bg-brand-50/40 text-center transition hover:border-brand-400 hover:bg-brand-50 disabled:opacity-60"
      >
        {src ? (
          <img src={src} alt={label} className="size-full object-cover" />
        ) : (
          <>
            <span className="flex size-11 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
              {uploading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <ImagePlus className="size-5" strokeWidth={1.8} />
              )}
            </span>
            <span className="text-sm font-medium text-brand-600">{label}</span>
          </>
        )}
      </button>

      {src && onClear && !uploading && (
        <button
          type="button"
          onClick={onClear}
          aria-label="Удалить"
          className="absolute right-2 top-2 flex size-7 items-center justify-center rounded-lg bg-white/90 text-ink shadow transition hover:bg-white"
        >
          <X className="size-4" />
        </button>
      )}

      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onSelect(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}
