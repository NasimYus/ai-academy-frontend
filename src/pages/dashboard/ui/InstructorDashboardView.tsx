import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { Box, ChevronRight, FileText, Package, PlayCircle, Plus, Video, Wallet } from 'lucide-react'
import type { ReactNode } from 'react'

import { instructorDashboardQueryOptions } from '#/entities/dashboard'
import { Spinner } from '#/shared/ui'

function Panel({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`rounded-3xl bg-white p-4 ${className}`}>{children}</div>
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h4 className="font-display text-sm font-bold text-ink">{children}</h4>
}

const TYPE_LABEL: Record<string, string> = {
  webinar: 'Живой курс',
  course: 'Видеокурс',
  text_lesson: 'Текстовый курс',
}

const fmtDate = (d: Date) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)

export function InstructorDashboardView({
  name,
  balance,
}: {
  name?: string | null
  balance: number
}) {
  const { data, isPending, isError, error } = useQuery(instructorDashboardQueryOptions)

  if (isPending) return <Spinner />
  if (isError) return <p className="text-red-600">{error.message}</p>

  const counters = [
    { label: 'Курсы', value: data.courses_count, icon: <PlayCircle className="size-6" /> },
    { label: 'Встречи', value: data.meetings_count, icon: <Video className="size-6" /> },
    { label: 'Товары', value: data.products_count, icon: <Box className="size-6" /> },
    { label: 'Пакеты курсов', value: data.bundles_count, icon: <Package className="size-6" /> },
  ]
  const overview = [
    { label: 'Живые курсы', value: data.live_courses, icon: <Video className="size-5" /> },
    { label: 'Видеокурсы', value: data.video_courses, icon: <PlayCircle className="size-5" /> },
    { label: 'Текстовые', value: data.text_courses, icon: <FileText className="size-5" /> },
  ]

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Main column */}
      <div className="space-y-6 lg:col-span-8">
        {/* Hello box */}
        <div className="rounded-3xl bg-gradient-to-br from-ink to-brand-700 p-6 text-white">
          <h1 className="truncate font-display text-2xl font-bold">
            Привет, {name ?? 'преподаватель'} 👋
          </h1>
          <p className="mt-2 text-sm text-white/75">
            Добро пожаловать! Управляйте курсами и продажами.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-y-5 sm:grid-cols-4">
            {counters.map((c) => (
              <div key={c.label} className="flex items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-full bg-white/15">
                  {c.icon}
                </span>
                <div>
                  <span className="block font-bold">{c.value}</span>
                  <span className="mt-0.5 block text-sm text-white/75">{c.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Manage courses */}
        <Panel>
          <div className="flex items-center justify-between">
            <SectionTitle>Управление курсами</SectionTitle>
            <Link
              to="/instructor/course/new"
              className="inline-flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-700"
            >
              <Plus className="size-4" />
              Создать курс
            </Link>
          </div>
          {data.manage_courses.length === 0 ? (
            <div className="mt-4 flex flex-col items-center rounded-2xl border border-dashed border-brand-200 bg-brand-50/40 p-8 text-center">
              <span className="flex size-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                <PlayCircle className="size-6" />
              </span>
              <h5 className="mt-3 text-sm font-semibold text-ink">Нет курсов</h5>
              <p className="mt-1 text-xs text-ink/50">Создайте первый курс и начните преподавать.</p>
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {data.manage_courses.map((c) => (
                <div key={c.id} className="rounded-2xl border border-brand-100 p-4">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                      <PlayCircle className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">{c.title}</p>
                      <p className="text-xs text-ink/50">{TYPE_LABEL[c.type] ?? c.type}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t border-brand-50 pt-3">
                    <span className="text-xs text-ink/50">{c.students_count} студентов</span>
                    <Link
                      to="/instructor/course/$courseId/statistics"
                      params={{ courseId: String(c.id) }}
                      className="inline-flex items-center gap-1 text-xs font-medium text-brand-600"
                    >
                      Просмотреть детали
                      <ChevronRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>

        {/* Courses overview */}
        <Panel>
          <SectionTitle>Обзор курсов</SectionTitle>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {overview.map((o) => (
              <div
                key={o.label}
                className="flex items-start justify-between rounded-2xl bg-brand-50/50 p-4"
              >
                <div>
                  <span className="text-xs text-ink/50">{o.label}</span>
                  <span className="mt-3 block font-display text-2xl font-bold text-ink">
                    {o.value}
                  </span>
                </div>
                <span className="flex size-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                  {o.icon}
                </span>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {/* Side column */}
      <div className="space-y-6 lg:col-span-4">
        <Panel>
          <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 px-4 pb-6 pt-4 text-white">
            <span className="font-display text-base font-bold">Текущий баланс</span>
            <span className="mt-1 block text-xs text-white/70">{fmtDate(new Date())}</span>
            <span className="mt-6 block font-display text-4xl font-bold">
              {balance > 0 ? `${balance.toLocaleString('ru-RU')}C` : 'Нет баланса'}
            </span>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <div>
              <span className="block text-sm font-bold text-ink">Кошелёк</span>
              <span className="mt-0.5 block text-xs text-ink/50">Управляйте своим балансом</span>
            </div>
            <Link
              to="/finance"
              className="flex size-10 items-center justify-center rounded-full border border-brand-100 text-ink/50 transition hover:bg-brand-50"
              aria-label="Финансы"
            >
              <Wallet className="size-4" />
            </Link>
          </div>
        </Panel>

        <Panel>
          <SectionTitle>Продажи</SectionTitle>
          <Link
            to="/instructor/sales"
            className="mt-4 flex items-center justify-between rounded-2xl bg-brand-50/50 p-4 text-sm text-ink transition hover:bg-brand-50"
          >
            Отчёт по продажам
            <ChevronRight className="size-4 text-ink/40" />
          </Link>
        </Panel>
      </div>
    </div>
  )
}
