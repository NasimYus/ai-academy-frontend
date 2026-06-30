import { STEPS } from '#/features/manage-course/ui/wizard/config'

export function Stepper({
  current,
  onJump,
}: {
  current: number // 1-based
  onJump?: (step: number) => void
}) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto rounded-2xl bg-white p-5 shadow-sm">
      {STEPS.map((step, i) => {
        const n = i + 1
        const active = n === current
        const Icon = step.icon
        const clickable = onJump != null
        return (
          <button
            key={step.key}
            type="button"
            disabled={!clickable}
            onClick={() => onJump?.(n)}
            className={`flex shrink-0 items-center gap-2.5 rounded-xl px-1 ${
              clickable ? 'cursor-pointer' : 'cursor-default'
            } ${active ? '' : 'opacity-60 transition hover:opacity-100'}`}
          >
            <span
              className={`flex size-12 items-center justify-center rounded-full transition ${
                active ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-400'
              }`}
            >
              <Icon className="size-5" strokeWidth={1.8} />
            </span>
            {active && (
              <span className="text-left">
                <span className="block text-xs text-ink/50">Шаг {n} из {STEPS.length}</span>
                <span className="block text-sm font-bold text-ink">{step.label}</span>
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
