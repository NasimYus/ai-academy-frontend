import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Ticket, Trash2 } from 'lucide-react'

import { ticketsQueryOptions } from '#/features/manage-course/api/tickets'
import { useTicketMutations } from '#/features/manage-course/model/use-tickets'
import { Button, EmptyState, Field } from '#/shared/ui'

const EMPTY = { title: '', discount: '', capacity: '', start_date: '', end_date: '' }

export function TariffPlans({ courseId }: { courseId: number }) {
  const tickets = useQuery(ticketsQueryOptions(courseId))
  const m = useTicketMutations(courseId)
  const [f, setF] = useState({ ...EMPTY })

  const set = (k: keyof typeof EMPTY, v: string) => setF((prev) => ({ ...prev, [k]: v }))

  const save = () => {
    if (!f.title.trim()) return
    m.add.mutate(
      {
        title: f.title.trim(),
        discount: f.discount ? Number(f.discount) : 0,
        capacity: f.capacity ? Number(f.capacity) : null,
        start_date: f.start_date ? new Date(f.start_date).toISOString() : null,
        end_date: f.end_date ? new Date(f.end_date).toISOString() : null,
      },
      { onSuccess: () => setF({ ...EMPTY }) },
    )
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50/40 p-4">
        <span className="flex size-11 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
          <Ticket className="size-5" strokeWidth={1.8} />
        </span>
        <div>
          <p className="text-sm font-bold text-ink">Тарифные планы</p>
          <p className="text-xs text-ink/55">
            Создавайте разные тарифы. Если план не создан, используется базовая цена.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-brand-100 p-4">
          <p className="text-sm font-bold text-ink">Новый тарифный план</p>
          <Field label="Название" value={f.title} onChange={(e) => set('title', e.target.value)} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Скидка (%)" type="number" min={0} max={100} value={f.discount} onChange={(e) => set('discount', e.target.value)} />
            <Field label="Вместимость" type="number" min={0} value={f.capacity} onChange={(e) => set('capacity', e.target.value)} />
            <Field label="Дата начала" type="datetime-local" value={f.start_date} onChange={(e) => set('start_date', e.target.value)} />
            <Field label="Дата окончания" type="datetime-local" value={f.end_date} onChange={(e) => set('end_date', e.target.value)} />
          </div>
          <Button size="sm" onClick={save} disabled={!f.title.trim() || m.add.isPending}>
            Сохранить
          </Button>
          {m.add.isError && <p className="text-sm text-red-600">{m.add.error.message}</p>}
        </div>

        <div>
          {tickets.data && tickets.data.length > 0 ? (
            <ul className="space-y-2">
              {tickets.data.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-brand-100 bg-white px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{t.title}</p>
                    <p className="text-xs text-ink/50">
                      Скидка {t.discount}%{t.capacity != null ? ` · мест: ${t.capacity}` : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label="Удалить"
                    onClick={() => m.remove.mutate(t.id)}
                    className="flex size-7 shrink-0 items-center justify-center rounded-lg text-ink/50 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon="🎟️">
              <p className="font-semibold text-ink">Тарифные планы не найдены!</p>
              <p className="mt-1 text-sm">Добавьте тарифы на основе времени и вместимости курса.</p>
            </EmptyState>
          )}
        </div>
      </div>
    </section>
  )
}
