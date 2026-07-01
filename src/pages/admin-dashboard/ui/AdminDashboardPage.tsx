import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { AlertCircle, MessageSquare, RefreshCw, ShoppingCart, Ticket } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'

import { adminDashboardQueryOptions } from '#/entities/admin-dashboard'
import type { AdminDashboard } from '#/entities/admin-dashboard'
import { useSessionStore } from '#/entities/session'
import { Avatar, LineChart, PageHeader, Spinner } from '#/shared/ui'
import { PanelLayout } from '#/widgets/panel-layout'

const num = (n: number) => n.toLocaleString('ru-RU')

const STATUS: Record<string, { label: string; tone: string }> = {
  is_draft: { label: 'Черновик', tone: 'bg-ink/10 text-ink/60' },
  pending: { label: 'Ожидание', tone: 'bg-amber-100 text-amber-700' },
  active: { label: 'Активен', tone: 'bg-green-100 text-green-700' },
  inactive: { label: 'Неактивен', tone: 'bg-red-100 text-red-700' },
}

function MetricCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-3xl bg-white p-6">
      <h3 className="font-display font-bold text-ink">{title}</h3>
      {children}
    </div>
  )
}

function TripleStat({ items }: { items: [string, number][] }) {
  return (
    <div className="mt-4 grid grid-cols-3 gap-2 text-center">
      {items.map(([label, value]) => (
        <div key={label}>
          <div className="font-display text-2xl font-bold text-ink">{num(value)}</div>
          <div className="mt-1 truncate text-xs text-ink/45">{label}</div>
        </div>
      ))}
    </div>
  )
}

function SmallCard({
  icon,
  tone,
  label,
  value,
}: {
  icon: ReactNode
  tone: string
  label: string
  value: number
}) {
  return (
    <div className="flex items-center gap-4 rounded-3xl bg-white p-5">
      <span className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${tone}`}>
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-ink">{label}</p>
        <p className="mt-1 font-display text-2xl font-bold text-ink">{num(value)}</p>
      </div>
    </div>
  )
}

function BlueCard({
  title,
  subtitle,
  children,
  to,
}: {
  title: string
  subtitle: string
  children?: ReactNode
  to: '/support'
}) {
  return (
    <div className="flex flex-col rounded-3xl bg-white p-5">
      <div className="rounded-2xl bg-brand-600 p-5 text-white">
        <h4 className="font-display text-lg font-bold">{title}</h4>
        <p className="mt-1 text-sm text-white/80">{subtitle}</p>
      </div>
      <div className="flex-1">{children}</div>
      <Link
        to={to}
        className="mt-4 self-center rounded-xl bg-brand-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
      >
        Показать всё
      </Link>
    </div>
  )
}

function CourseRows({ rows }: { rows: AdminDashboard['recent_webinars'] }) {
  if (rows.length === 0) return <p className="py-6 text-center text-sm text-ink/40">Пусто</p>
  return (
    <div className="divide-y divide-brand-50">
      {rows.map((c) => {
        const s = STATUS[c.status] ?? { label: c.status, tone: 'bg-ink/10 text-ink/60' }
        return (
          <div key={c.id} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{c.title}</p>
              <p className="truncate text-xs text-ink/45">{c.teacher_name ?? '—'}</p>
            </div>
            <span className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${s.tone}`}>
              {s.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export function AdminDashboardPage() {
  const user = useSessionStore((s) => s.user)
  const qc = useQueryClient()
  const { data, isPending, isError, error } = useQuery(adminDashboardQueryOptions)
  const [range, setRange] = useState<'month' | 'year'>('year')

  if (isPending) {
    return (
      <PanelLayout>
        <Spinner />
      </PanelLayout>
    )
  }
  if (isError) {
    return (
      <PanelLayout>
        <p className="text-red-600">{error.message}</p>
      </PanelLayout>
    )
  }

  const chart = range === 'year' ? data.sales_chart_year : data.sales_chart_month
  const yearStat = data.sales_stats.year

  return (
    <PanelLayout>
      <PageHeader title="Панель управления" />

      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-ink to-brand-700 p-6 text-white lg:p-8">
        <h1 className="font-display text-2xl font-bold">
          Добро пожаловать, {user?.full_name ?? 'Администратор'}!
        </h1>
        <p className="mt-2 text-sm text-white/70">
          Всё под вашим контролем. Используйте быстрые кнопки для лёгкого управления.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            to="/admin/reviews"
            className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-4 py-2.5 text-sm transition hover:bg-white/10"
          >
            <MessageSquare className="size-4" />
            Комментарии
          </Link>
          <Link
            to="/support"
            className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-4 py-2.5 text-sm transition hover:bg-white/10"
          >
            <Ticket className="size-4" />
            Тикеты
          </Link>
          <Link
            to="/admin/reviews"
            className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-4 py-2.5 text-sm transition hover:bg-white/10"
          >
            <AlertCircle className="size-4" />
            Жалобы
          </Link>
          <button
            type="button"
            onClick={() => void qc.invalidateQueries({ queryKey: ['admin-dashboard'] })}
            className="ml-auto inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm transition hover:bg-white/20"
          >
            <RefreshCw className="size-4" />
            Очистить кэш
          </button>
        </div>
      </div>

      {/* Metric cards */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <MetricCard title="Ежедневные продажи по типу курса">
          <TripleStat
            items={[
              ['Онлайн-курсы', data.daily_sales_by_type.webinars],
              ['Курс', data.daily_sales_by_type.courses],
              ['Встреча', data.daily_sales_by_type.appointments],
            ]}
          />
          <p className="mt-4 border-t border-brand-50 pt-3 text-sm text-ink/50">
            Продажи сегодня:{' '}
            <span className="font-bold text-ink">{num(data.daily_sales_by_type.total)}</span>
          </p>
        </MetricCard>

        <MetricCard title="Доход платформы">
          <TripleStat
            items={[
              ['Сегодня', data.income.today],
              ['Этот месяц', data.income.month],
              ['Этот год', data.income.year],
            ]}
          />
          <p className="mt-4 border-t border-brand-50 pt-3 text-sm text-ink/50">
            Общий доход: <span className="font-bold text-ink">{num(data.income.total)} C</span>
          </p>
        </MetricCard>

        <MetricCard title="Количество продаж">
          <TripleStat
            items={[
              ['Сегодня', data.sales_counts.today],
              ['Этот месяц', data.sales_counts.month],
              ['Этот год', data.sales_counts.year],
            ]}
          />
          <p className="mt-4 border-t border-brand-50 pt-3 text-sm text-ink/50">
            Всего продаж: <span className="font-bold text-ink">{num(data.sales_counts.total)}</span>
          </p>
        </MetricCard>
      </div>

      {/* Small counters */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SmallCard
          icon={<ShoppingCart className="size-6" />}
          tone="bg-brand-50 text-brand-600"
          label="Новая продажа"
          value={data.new_sales}
        />
        <SmallCard
          icon={<MessageSquare className="size-6" />}
          tone="bg-red-50 text-red-500"
          label="Новый комментарий"
          value={data.new_comments}
        />
        <SmallCard
          icon={<Ticket className="size-6" />}
          tone="bg-amber-50 text-amber-500"
          label="Новое обращение в поддержку"
          value={data.new_tickets}
        />
        <SmallCard
          icon={<AlertCircle className="size-6" />}
          tone="bg-green-50 text-green-600"
          label="Курсы, ожидающие проверки"
          value={data.pending_reviews}
        />
      </div>

      {/* Sales chart + recent comments */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-ink">Статистика продаж</h3>
            <div className="flex gap-1 rounded-lg bg-brand-50 p-1 text-sm">
              {(['month', 'year'] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRange(r)}
                  className={`rounded-md px-3 py-1 transition ${
                    range === r ? 'bg-brand-600 text-white' : 'text-ink/60'
                  }`}
                >
                  {r === 'month' ? 'Месяц' : 'Год'}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <LineChart labels={chart.labels} data={chart.data} />
          </div>
          <p className="mt-3 text-sm text-ink/50">
            Продажи за год: <span className="font-bold text-ink">{num(yearStat.amount)} C</span>
            <span className="ml-2 text-xs text-ink/40">{yearStat.grow_percent}</span>
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6">
          <h3 className="font-display font-bold text-ink">Последние комментарии</h3>
          {data.recent_comments.length === 0 ? (
            <p className="mt-6 text-center text-sm text-ink/40">Нет комментариев</p>
          ) : (
            <div className="mt-4 space-y-4">
              {data.recent_comments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <Avatar name={c.user_name} size={40} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink">{c.user_name ?? 'Пользователь'}</p>
                    <p className="truncate text-sm text-ink/55">{c.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Blue cards */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <BlueCard
          title="Последние обращения в поддержку"
          subtitle={`${data.recent_tickets_pending} ожидает ответа`}
          to="/support"
        />
        <BlueCard
          title="Последние онлайн курсы"
          subtitle={`${data.recent_webinars_pending} ожидает проверки`}
          to="/support"
        >
          <div className="mt-2">
            <CourseRows rows={data.recent_webinars} />
          </div>
        </BlueCard>
        <BlueCard
          title="Последние курсы"
          subtitle={`${data.recent_courses_pending} ожидает проверки`}
          to="/support"
        >
          <div className="mt-2">
            <CourseRows rows={data.recent_courses} />
          </div>
        </BlueCard>
      </div>

      {/* Users chart */}
      <div className="mt-6 rounded-3xl bg-white p-6">
        <h3 className="font-display font-bold text-ink">Статистика регистраций пользователей</h3>
        <div className="mt-4">
          <LineChart labels={data.users_chart.labels} data={data.users_chart.data} />
        </div>
      </div>
    </PanelLayout>
  )
}
