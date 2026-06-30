import { ArrowLeft, ArrowRight } from 'lucide-react'

import { Button } from '#/shared/ui'

export function BottomBar({
  step,
  total,
  saving,
  canDelete,
  onPrev,
  onNext,
  onSaveDraft,
  onDelete,
  onSubmit,
}: {
  step: number
  total: number
  saving: boolean
  canDelete: boolean
  onPrev: () => void
  onNext: () => void
  onSaveDraft: () => void
  onDelete: () => void
  onSubmit: () => void
}) {
  const isFirst = step === 1
  const isLast = step === total
  const arrow =
    'flex size-11 items-center justify-center rounded-full border border-brand-200 text-brand-600 transition hover:bg-brand-50 disabled:opacity-40'

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
      <div className="flex items-center gap-3">
        <button type="button" aria-label="Назад" disabled={isFirst || saving} onClick={onPrev} className={arrow}>
          <ArrowLeft className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Далее"
          disabled={isLast || saving}
          onClick={onNext}
          className={arrow}
        >
          <ArrowRight className="size-5" />
        </button>
      </div>

      <div className="flex items-center gap-5">
        <button
          type="button"
          disabled={saving}
          onClick={onSaveDraft}
          className="text-sm font-medium text-ink/50 transition hover:text-ink disabled:opacity-50"
        >
          Сохранить как черновик
        </button>
        {canDelete && (
          <button
            type="button"
            disabled={saving}
            onClick={onDelete}
            className="text-sm font-medium text-red-500 transition hover:text-red-600 disabled:opacity-50"
          >
            Удалить
          </button>
        )}
        <Button onClick={onSubmit} disabled={saving}>
          Отправить на проверку
        </Button>
      </div>
    </div>
  )
}
