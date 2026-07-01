import { useEffect, useRef } from 'react'
import {
  Bold,
  Heading2,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Underline,
} from 'lucide-react'

// Lightweight dependency-free rich-text editor (contentEditable + execCommand).
// Emits HTML via `onChange`; initialised once from `value` to keep the caret.
export function RichEditor({
  label,
  value,
  onChange,
  placeholder,
  minHeight = 200,
}: {
  label?: string
  value: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  // Seed the editor once (and when it's externally cleared / replaced while blurred).
  useEffect(() => {
    const el = ref.current
    if (el && el.innerHTML !== value && document.activeElement !== el) {
      el.innerHTML = value
    }
  }, [value])

  const exec = (command: string, arg?: string) => {
    ref.current?.focus()
    document.execCommand(command, false, arg)
    if (ref.current) onChange(ref.current.innerHTML)
  }

  const addLink = () => {
    const url = window.prompt('Введите ссылку (URL):', 'https://')
    if (url) exec('createLink', url)
  }

  const tools: { label: string; icon: typeof Bold; action: () => void }[] = [
    { label: 'Жирный', icon: Bold, action: () => exec('bold') },
    { label: 'Курсив', icon: Italic, action: () => exec('italic') },
    { label: 'Подчёркнутый', icon: Underline, action: () => exec('underline') },
    { label: 'Заголовок', icon: Heading2, action: () => exec('formatBlock', '<h2>') },
    { label: 'Маркированный список', icon: List, action: () => exec('insertUnorderedList') },
    { label: 'Нумерованный список', icon: ListOrdered, action: () => exec('insertOrderedList') },
    { label: 'Ссылка', icon: LinkIcon, action: addLink },
  ]

  const field = (
    <div className="overflow-hidden rounded-lg border border-brand-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-200">
      <div className="flex flex-wrap gap-0.5 border-b border-brand-100 bg-brand-50/40 p-1.5">
        {tools.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.label}
              type="button"
              title={t.label}
              aria-label={t.label}
              onMouseDown={(e) => e.preventDefault()}
              onClick={t.action}
              className="flex size-8 items-center justify-center rounded-md text-ink/60 transition hover:bg-white hover:text-brand-600"
            >
              <Icon className="size-4" strokeWidth={1.9} />
            </button>
          )
        })}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        className="rich-editor prose-sm max-w-none px-3 py-2.5 text-sm text-ink outline-none"
        style={{ minHeight }}
      />
    </div>
  )

  if (!label) return field
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
      {label}
      {field}
    </label>
  )
}
