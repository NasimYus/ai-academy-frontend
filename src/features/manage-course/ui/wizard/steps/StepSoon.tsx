import { Hammer } from 'lucide-react'

import { STEPS } from '#/features/manage-course/ui/wizard/config'

export function StepSoon({ step }: { step: number }) {
  const label = STEPS[step - 1]?.label ?? ''
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-brand-200 py-20 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-400">
        <Hammer className="size-6" strokeWidth={1.8} />
      </span>
      <p className="text-base font-bold text-ink">{label}</p>
      <p className="max-w-sm text-sm text-ink/50">
        Этот шаг скоро появится. Сейчас доступны «Основная информация», «Дополнительная информация» и
        «Цены» — их можно сохранять и редактировать.
      </p>
    </div>
  )
}
