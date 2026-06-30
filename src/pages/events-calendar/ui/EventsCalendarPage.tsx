import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight, ClipboardCheck, NotebookPen, Users, Video } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { ComponentType } from 'react'

import { eventsCalendarQueryOptions } from '#/entities/events-calendar'
import type { CalendarEvent } from '#/entities/events-calendar'
import { PageHeader, Spinner } from '#/shared/ui'
import { PanelLayout } from '#/widgets/panel-layout'

// Legacy event-group labels (trans('update.{type}')) + an icon per group.
const TYPE_LABEL: Record<string, string> = {
  courses_expirations: 'Окончание доступа к курсу',
  quiz_expirations: 'Окончание теста',
  live_sessions: 'Онлайн-сессия',
  assignment_expirations: 'Дедлайн задания',
  bundle_expirations: 'Окончание доступа к набору',
  subscription_expirations: 'Окончание подписки',
  registration_package_expirations: 'Окончание пакета',
  installments: 'Платёж по рассрочке',
  meetings: 'Встреча',
  live_class_start: 'Начало живого класса',
  events_start_date: 'Начало мероприятия',
}
const TYPE_ICON: Record<string, ComponentType<{ className?: string }>> = {
  meetings: Users,
  live_class_start: Video,
  live_sessions: Video,
  quiz_expirations: ClipboardCheck,
}

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const MONTHS = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
]

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
const fmtDay = (d: Date) =>
  new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)

function gcalLink(title: string, iso: string) {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  const stamp = `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(
    d.getUTCHours(),
  )}${pad(d.getUTCMinutes())}00Z`
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    title,
  )}&dates=${stamp}/${stamp}`
}

function EventRow({ event }: { event: CalendarEvent }) {
  const Icon = TYPE_ICON[event.type] ?? NotebookPen
  return (
    <div className="mt-4 flex items-center justify-between rounded-2xl bg-brand-50/50 p-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
          <Icon className="size-6" />
        </span>
        <div className="min-w-0">
          <div className="text-sm text-ink">{TYPE_LABEL[event.type] ?? event.type}</div>
          <p className="truncate text-xs text-ink/50">{event.subtitle}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        {event.time && (
          <span className="rounded-lg bg-brand-100/70 px-2 py-1 text-xs text-ink/60">
            {event.time}
          </span>
        )}
        <a
          href={gcalLink(TYPE_LABEL[event.type] ?? event.type, event.event_at)}
          target="_blank"
          rel="noreferrer"
          className="flex size-9 items-center justify-center rounded-full bg-white text-ink/50 transition hover:bg-brand-50"
          aria-label="Добавить в календарь"
        >
          <NotebookPen className="size-4" />
        </a>
      </div>
    </div>
  )
}

export function EventsCalendarPage() {
  const { data, isPending, isError, error } = useQuery(eventsCalendarQueryOptions)
  const today = new Date()
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() })
  const [selected, setSelected] = useState<Date>(today)

  const events = useMemo(() => data?.events ?? [], [data])
  const byDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>()
    for (const e of events) {
      const k = dayKey(new Date(e.event_at))
      const list = map.get(k) ?? []
      list.push(e)
      map.set(k, list)
    }
    return map
  }, [events])

  const dayEvents = byDay.get(dayKey(selected)) ?? []
  const upcoming = events.slice(0, 5)

  // Month grid: Monday-first, 6 weeks.
  const firstOfMonth = new Date(view.year, view.month, 1)
  const startOffset = (firstOfMonth.getDay() + 6) % 7 // Mon=0
  const cells: (Date | null)[] = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate()
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(view.year, view.month, d))
  while (cells.length % 7 !== 0) cells.push(null)

  const shiftMonth = (delta: number) => {
    const m = view.month + delta
    setView({ year: view.year + Math.floor(m / 12), month: ((m % 12) + 12) % 12 })
  }

  return (
    <PanelLayout>
      <PageHeader title="Календарь событий" />
      {isPending ? (
        <Spinner />
      ) : isError ? (
        <p className="text-red-600">{error.message}</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Calendar picker */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl bg-white p-4">
              <div className="border-b border-brand-50 pb-3">
                <h3 className="font-display text-sm font-bold text-ink">Выберите дату</h3>
                <p className="mt-1 text-xs text-ink/50">
                  Выберите дату в календаре, чтобы посмотреть события.
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => shiftMonth(-1)}
                  className="flex size-8 items-center justify-center rounded-lg text-ink/50 transition hover:bg-brand-50"
                  aria-label="Предыдущий месяц"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <span className="font-display text-sm font-bold text-ink">
                  {MONTHS[view.month]} {view.year}
                </span>
                <button
                  type="button"
                  onClick={() => shiftMonth(1)}
                  className="flex size-8 items-center justify-center rounded-lg text-ink/50 transition hover:bg-brand-50"
                  aria-label="Следующий месяц"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>

              <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs text-ink/40">
                {WEEKDAYS.map((w) => (
                  <span key={w} className="py-1">
                    {w}
                  </span>
                ))}
              </div>
              <div className="mt-1 grid grid-cols-7 gap-1 text-center text-sm">
                {cells.map((cell, i) => {
                  if (!cell) return <span key={`e${i}`} />
                  const isSelected = dayKey(cell) === dayKey(selected)
                  const isToday = dayKey(cell) === dayKey(today)
                  const has = byDay.has(dayKey(cell))
                  return (
                    <button
                      key={dayKey(cell)}
                      type="button"
                      onClick={() => setSelected(cell)}
                      className={`relative flex h-9 items-center justify-center rounded-lg transition ${
                        isSelected
                          ? 'bg-brand-500 font-semibold text-white'
                          : isToday
                            ? 'bg-brand-50 text-brand-700'
                            : 'text-ink/70 hover:bg-brand-50'
                      }`}
                    >
                      {cell.getDate()}
                      {has && !isSelected && (
                        <span className="absolute bottom-1 size-1 rounded-full bg-brand-500" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Day events */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl bg-white p-4">
              <div className="border-b border-brand-50 pb-3">
                <h3 className="font-display text-sm font-bold text-ink">
                  События за {fmtDay(selected)}
                </h3>
                <p className="mt-1 text-xs text-ink/50">
                  Просматривайте события и добавляйте их в напоминания.
                </p>
              </div>
              {dayEvents.length > 0 ? (
                dayEvents.map((e, i) => <EventRow key={`${e.type}-${i}`} event={e} />)
              ) : (
                <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 p-12 text-center">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                    <NotebookPen className="size-6" />
                  </span>
                  <h5 className="mt-3 text-sm font-semibold text-ink">События не найдены!</h5>
                  <p className="mt-1 text-xs text-ink/50">
                    Для выбранной даты нет доступных событий.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl bg-white p-4">
              <div className="border-b border-brand-50 pb-3">
                <h3 className="font-display text-sm font-bold text-ink">Предстоящие события</h3>
                <p className="mt-1 text-xs text-ink/50">
                  Просматривайте предстоящие события и добавляйте их в напоминания.
                </p>
              </div>
              {upcoming.length > 0 ? (
                upcoming.map((e, i) => {
                  const d = new Date(e.event_at)
                  return (
                    <button
                      key={`${e.type}-${i}`}
                      type="button"
                      onClick={() => {
                        setSelected(d)
                        setView({ year: d.getFullYear(), month: d.getMonth() })
                      }}
                      className="mt-4 flex w-full items-center gap-3 rounded-2xl bg-brand-50/50 p-3 text-left transition hover:bg-brand-50"
                    >
                      <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                        <span className="text-sm font-bold leading-none">{d.getDate()}</span>
                        <span className="mt-1 text-xs leading-none text-ink/50">
                          {MONTHS[d.getMonth()].slice(0, 3)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm text-ink">{TYPE_LABEL[e.type] ?? e.type}</div>
                        <p className="truncate text-xs text-ink/50">{e.subtitle}</p>
                      </div>
                    </button>
                  )
                })
              ) : (
                <p className="mt-4 text-center text-xs text-ink/40">Нет предстоящих событий</p>
              )}
            </div>
          </div>
        </div>
      )}
    </PanelLayout>
  )
}
