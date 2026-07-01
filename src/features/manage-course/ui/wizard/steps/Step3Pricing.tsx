import { Field, Switch } from '#/shared/ui'

import { TariffPlans } from '#/features/manage-course/ui/wizard/steps/TariffPlans'
import type { StepProps } from '#/features/manage-course/ui/wizard/steps/types'

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sm font-bold text-ink">{children}</h2>
}

export function Step3Pricing({ f, set, courseId }: StepProps & { courseId?: number }) {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionTitle>Параметры ценообразования</SectionTitle>
        <Field
          label="Цена (c)"
          type="number"
          min={0}
          value={f.price}
          onChange={(e) => set('price', e.target.value)}
          placeholder="Введите 0, чтобы сделать бесплатным"
        />
        <div className="space-y-1">
          <Field
            label="Период доступа (в днях) (необязательно)"
            type="number"
            min={0}
            value={f.access_days}
            onChange={(e) => set('access_days', e.target.value)}
            placeholder="Дни"
          />
          <p className="text-xs text-ink/50">
            После истечения срока доступа необходимо купить повторно.
          </p>
        </div>

        <Switch
          checked={f.subscribe}
          onChange={(v) => set('subscribe', v)}
          label="Включить подписку"
          hint="Студенты могут подписаться на ваш контент помимо прямых покупок."
        />
      </section>

      {courseId ? (
        <TariffPlans courseId={courseId} />
      ) : (
        <p className="rounded-xl border border-dashed border-brand-200 px-4 py-6 text-center text-sm text-ink/50">
          Тарифные планы станут доступны после сохранения курса.
        </p>
      )}
    </div>
  )
}
