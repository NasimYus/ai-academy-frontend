import { useState } from 'react'

import type { DayLabel, MeetingConfig } from '#/entities/meeting'

import {
  useAddSlot,
  useDeleteSlot,
  useUpdateMeeting,
} from '#/features/manage-meeting/model/use-manage'

const DAYS: { value: DayLabel; label: string }[] = [
  { value: 'monday', label: 'Пн' },
  { value: 'tuesday', label: 'Вт' },
  { value: 'wednesday', label: 'Ср' },
  { value: 'thursday', label: 'Чт' },
  { value: 'friday', label: 'Пт' },
  { value: 'saturday', label: 'Сб' },
  { value: 'sunday', label: 'Вс' },
]

/** Instructor consultation config: price/enabled + weekly availability slots. */
export function MeetingConfigForm({ config }: { config: MeetingConfig }) {
  const update = useUpdateMeeting()
  const addSlot = useAddSlot()
  const delSlot = useDeleteSlot()

  const [amount, setAmount] = useState(config.amount != null ? String(config.amount) : '')
  const [disabled, setDisabled] = useState(config.disabled)
  const [day, setDay] = useState<DayLabel>('monday')
  const [time, setTime] = useState('10:00-11:00')

  return (
    <div className="space-y-5">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          update.mutate({ amount: amount ? Number(amount) : null, disabled })
        }}
        className="space-y-3 rounded-xl border border-brand-100 bg-white p-4"
      >
        <label className="block text-sm text-ink/70">
          Цена за консультацию
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0 = бесплатно"
            className="mt-1 w-full rounded-lg border border-brand-200 px-3 py-2 text-sm"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-ink/70">
          <input
            type="checkbox"
            checked={disabled}
            onChange={(e) => setDisabled(e.target.checked)}
          />
          Консультации отключены
        </label>
        {update.isError && <p className="text-sm text-red-600">{update.error.message}</p>}
        <button
          type="submit"
          disabled={update.isPending}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
        >
          {update.isPending ? 'Сохранение…' : 'Сохранить'}
        </button>
      </form>

      <div className="space-y-2 rounded-xl border border-brand-100 bg-white p-4">
        <h3 className="text-sm font-semibold text-ink/70">Доступные слоты</h3>
        {config.times.length === 0 ? (
          <p className="text-sm text-ink/50">Слотов пока нет.</p>
        ) : (
          <ul className="space-y-1">
            {config.times.map((t) => (
              <li key={t.id} className="flex items-center justify-between text-sm">
                <span className="text-ink">
                  {DAYS.find((d) => d.value === t.day_label)?.label ?? t.day_label} · {t.time}
                </span>
                <button
                  type="button"
                  onClick={() => delSlot.mutate(t.id)}
                  className="text-red-600 hover:underline"
                >
                  Удалить
                </button>
              </li>
            ))}
          </ul>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault()
            addSlot.mutate({ dayLabel: day, time })
          }}
          className="flex flex-wrap items-center gap-2 pt-2"
        >
          <select
            value={day}
            onChange={(e) => setDay(e.target.value as DayLabel)}
            className="rounded-lg border border-brand-200 px-3 py-1.5 text-sm"
          >
            {DAYS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="10:00-11:00"
            className="w-32 rounded-lg border border-brand-200 px-3 py-1.5 text-sm"
          />
          <button
            type="submit"
            disabled={addSlot.isPending}
            className="rounded-lg border border-brand-200 px-3 py-1.5 text-sm font-medium text-brand-700 transition hover:bg-brand-50 disabled:opacity-50"
          >
            Добавить
          </button>
        </form>
      </div>
    </div>
  )
}
