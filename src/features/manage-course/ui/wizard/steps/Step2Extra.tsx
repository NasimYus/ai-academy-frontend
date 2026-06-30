import { useQuery } from '@tanstack/react-query'

import { categoriesQueryOptions } from '#/entities/category'
import { Field, Select, Switch } from '#/shared/ui'

import type { StepProps } from '#/features/manage-course/ui/wizard/steps/types'

const TIMEZONES = ['Asia/Dushanbe', 'Asia/Tashkent', 'Europe/Moscow', 'America/New_York', 'UTC']

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-sm font-bold text-ink">{children}</h2>
}

export function Step2Extra({ f, set }: StepProps) {
  const categories = useQuery(categoriesQueryOptions)
  const options = (categories.data ?? []).flatMap((c) => [
    { id: c.id, title: c.title },
    ...c.sub_categories.map((s) => ({ id: s.id, title: `— ${s.title}` })),
  ])

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <SectionTitle>Категории и фильтры</SectionTitle>
        <Select
          label="Категория *"
          value={f.category_id}
          onChange={(e) => set('category_id', e.target.value)}
        >
          <option value="">Выберите категорию</option>
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.title}
            </option>
          ))}
        </Select>
      </section>

      <section className="space-y-4">
        <SectionTitle>Параметры курса</SectionTitle>

        <div className="space-y-1">
          <Field
            label="Вместимость"
            type="number"
            min={0}
            value={f.capacity}
            onChange={(e) => set('capacity', e.target.value)}
            placeholder="Сколько студентов вы планируете принять?"
          />
          <p className="text-xs text-ink/50">Оставьте поле пустым, если нет ограничений.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {f.type === 'webinar' && (
            <Field
              label="Дата начала *"
              type="datetime-local"
              value={f.start_date}
              onChange={(e) => set('start_date', e.target.value)}
            />
          )}
          <Field
            label="Продолжительность * (минуты)"
            type="number"
            min={0}
            value={f.duration}
            onChange={(e) => set('duration', e.target.value)}
          />
        </div>

        <Select label="Часовой пояс" value={f.timezone} onChange={(e) => set('timezone', e.target.value)}>
          {TIMEZONES.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </Select>

        <div className="space-y-4 pt-2">
          <Switch
            checked={f.forum}
            onChange={(v) => set('forum', v)}
            label="Форум курса"
            hint="Включите, чтобы студенты могли создавать темы и участвовать в обсуждениях."
          />
          <Switch checked={f.support} onChange={(v) => set('support', v)} label="Поддержка" />
          <Switch
            checked={f.downloadable}
            onChange={(v) => set('downloadable', v)}
            label="Доступно для скачивания"
          />
          <Switch
            checked={f.partner_instructor}
            onChange={(v) => set('partner_instructor', v)}
            label="Совместный преподаватель"
          />
        </div>
      </section>
    </div>
  )
}
