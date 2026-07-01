import { Switch, Textarea } from '#/shared/ui'

import type { StepProps } from '#/features/manage-course/ui/wizard/steps/types'

export function Step8Reviewer({ f, set }: StepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-ink">Сообщение рецензенту</h2>
        <Textarea
          label="Сообщение"
          rows={8}
          value={f.message_for_reviewer}
          onChange={(e) => set('message_for_reviewer', e.target.value)}
          placeholder="Дополнительная информация для модератора (необязательно)"
        />
      </div>

      <Switch
        checked={f.rules}
        onChange={(v) => set('rules', v)}
        label="Я согласен с условиями и правилами."
      />

      <p className="rounded-xl border border-brand-100 bg-brand-50/40 px-4 py-3 text-xs text-ink/55">
        После нажатия «Отправить на проверку» курс перейдёт в статус «на проверке» и станет доступен
        модератору. Пока проверка не завершена, курс не публикуется.
      </p>
    </div>
  )
}
