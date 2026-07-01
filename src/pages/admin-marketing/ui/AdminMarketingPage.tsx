import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { BadgePercent, LayoutDashboard, Star, UserX, Users } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'

import { adminMarketingQueryOptions } from '#/entities/admin-marketing'
import type { AdminMarketing } from '#/entities/admin-marketing'
import { LineChart, PageHeader, PieChart, Spinner } from '#/shared/ui'
import { PanelLayout } from '#/widgets/panel-layout'

const num = (n: number) => n.toLocaleString('ru-RU')

// Course-type palette (parity of legacy marketing pie legend).
const TYPE_COLORS = ['#22c55e', '#1e293b', '#f59e0b'] // webinar / course / text_lesson

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
      <span className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${tone}`}>
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink/70">{label}</p>
        <p className="mt-1 font-display text-3xl font-bold text-ink">{num(value)}</p>
      </div>
    </div>
  )
}

function StatFoot({ stat, label }: { stat?: AdminMarketing['net_profit_stats'][string]; label: string }) {
  const up = stat?.grow_status !== 'down'
  return (
    <div className="text-center">
      <div className={`flex items-center justify-center gap-1 text-xs ${up ? 'text-green-600' : 'text-red-500'}`}>
        <span>{up ? '▲' : '▼'}</span>
        <span className="text-ink/40">{stat?.grow_percent ?? '—'}</span>
      </div>
      <div className="mt-1 font-display text-2xl font-bold text-ink">{num(stat?.amount ?? 0)}</div>
      <div className="mt-1 text-xs text-ink/45">{label}</div>
    </div>
  )
}

function Panel({
  title,
  more,
  children,
}: {
  title: string
  more?: '/admin/courses' | '/admin/users'
  children: ReactNode
}) {
  return (
    <div className="rounded-3xl bg-white p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display font-bold text-ink">{title}</h3>
        {more ? (
          <Link
            to={more}
            className="inline-flex items-center gap-1 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            Посмотреть больше
            <span aria-hidden>›</span>
          </Link>
        ) : null}
      </div>
      <div className="mt-4 overflow-x-auto">{children}</div>
    </div>
  )
}

function Th({ children, right }: { children: ReactNode; right?: boolean }) {
  return (
    <th
      className={`px-3 py-2 text-xs font-semibold uppercase tracking-wide text-ink/40 ${right ? 'text-right' : 'text-left'}`}
    >
      {children}
    </th>
  )
}

function Td({ children, right }: { children: ReactNode; right?: boolean }) {
  return (
    <td className={`px-3 py-3 text-sm text-ink ${right ? 'text-right tabular-nums' : ''}`}>
      {children}
    </td>
  )
}

function EmptyRow({ span }: { span: number }) {
  return (
    <tr>
      <td colSpan={span} className="px-3 py-8 text-center text-sm text-ink/40">
        Нет данных
      </td>
    </tr>
  )
}

export function AdminMarketingPage() {
  const { data, isPending, isError, error } = useQuery(adminMarketingQueryOptions)
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

  const chart = range === 'year' ? data.net_profit_chart_year : data.net_profit_chart_month
  const typeLabels = data.classes_statistics.labels.map(
    (l) => ({ webinar: 'Вебинар', course: 'Курс', text_lesson: 'Текстовый урок' })[l] ?? l,
  )

  return (
    <PanelLayout>
      <PageHeader
        title="Маркетинговая панель"
        actions={
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 rounded-xl border border-brand-100 px-4 py-2 text-sm font-medium text-brand-700 transition hover:bg-brand-50"
          >
            <LayoutDashboard className="size-4" />
            Панель управления
          </Link>
        }
      />

      {/* Counters */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SmallCard
          icon={<UserX className="size-7" />}
          tone="bg-amber-50 text-amber-500"
          label="Пользователи без покупок"
          value={data.users_without_purchases}
        />
        <SmallCard
          icon={<Users className="size-7" />}
          tone="bg-red-50 text-red-500"
          label="Инструкторы без курсов"
          value={data.teachers_without_class}
        />
        <SmallCard
          icon={<Star className="size-7" />}
          tone="bg-indigo-50 text-indigo-500"
          label="Рекомендуемые курсы"
          value={data.featured_classes}
        />
        <SmallCard
          icon={<BadgePercent className="size-7" />}
          tone="bg-green-50 text-green-600"
          label="Активные скидки"
          value={data.active_discounts}
        />
      </div>

      {/* Net profit chart + course types */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-ink">Статистика чистой прибыли (без налога)</h3>
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
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-brand-50 pt-4 sm:grid-cols-4">
            <StatFoot stat={data.net_profit_stats.today} label="Прибыль за сегодня" />
            <StatFoot stat={data.net_profit_stats.week} label="Прибыль за неделю" />
            <StatFoot stat={data.net_profit_stats.month} label="Прибыль за месяц" />
            <StatFoot stat={data.net_profit_stats.year} label="Прибыль за год" />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6">
          <h3 className="font-display font-bold text-ink">Типы курсов</h3>
          <div className="mt-8">
            <PieChart
              labels={typeLabels}
              data={data.classes_statistics.data}
              colors={TYPE_COLORS}
            />
          </div>
        </div>
      </div>

      {/* Top selling classes + appointments */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel title="Самые продаваемые курсы" more="/admin/courses">
          <table className="w-full min-w-[24rem]">
            <thead>
              <tr className="border-b border-brand-50">
                <Th>#</Th>
                <Th>Имя</Th>
                <Th right>Продажи</Th>
                <Th right>Доход</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {data.top_selling_classes.length === 0 ? (
                <EmptyRow span={4} />
              ) : (
                data.top_selling_classes.map((c, i) => (
                  <tr key={c.id}>
                    <Td>{i + 1}</Td>
                    <Td>{c.title}</Td>
                    <Td right>{num(c.sales_count)}</Td>
                    <Td right>{num(c.sales_amount)} C</Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Panel>

        <Panel title="Самые продаваемые встречи" more="/admin/courses">
          <table className="w-full min-w-[24rem]">
            <thead>
              <tr className="border-b border-brand-50">
                <Th>#</Th>
                <Th>Консультант</Th>
                <Th right>Продажи</Th>
                <Th right>Доход</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {data.top_selling_appointments.length === 0 ? (
                <EmptyRow span={4} />
              ) : (
                data.top_selling_appointments.map((m, i) => (
                  <tr key={m.id}>
                    <Td>{i + 1}</Td>
                    <Td>{m.consultant_name ?? '—'}</Td>
                    <Td right>{num(m.sales_count)}</Td>
                    <Td right>{num(m.sales_amount)} C</Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Panel>
      </div>

      {/* Top selling teachers + organizations */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {(
          [
            ['Инструкторы с наибольшими продажами', data.top_selling_teachers],
            ['Организации с наибольшими продажами', data.top_selling_organizations],
          ] as const
        ).map(([title, rows]) => (
          <Panel key={title} title={title} more="/admin/users">
            <table className="w-full min-w-[30rem]">
              <thead>
                <tr className="border-b border-brand-50">
                  <Th>ID</Th>
                  <Th>Имя</Th>
                  <Th>Длительность курсов</Th>
                  <Th right>Продажи</Th>
                  <Th right>Доход</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-50">
                {rows.length === 0 ? (
                  <EmptyRow span={5} />
                ) : (
                  rows.map((u) => (
                    <tr key={u.id}>
                      <Td>{u.id}</Td>
                      <Td>{u.name ?? '—'}</Td>
                      <Td>{Math.round(u.classes_duration / 60)} ч</Td>
                      <Td right>{num(u.sales_count)}</Td>
                      <Td right>{num(u.sales_amount)} C</Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </Panel>
        ))}
      </div>

      {/* Most active students */}
      <div className="mt-6">
        <Panel title="Самые активные студенты" more="/admin/users">
          <table className="w-full min-w-[36rem]">
            <thead>
              <tr className="border-b border-brand-50">
                <Th>#</Th>
                <Th>Имя</Th>
                <Th right>Купленные курсы</Th>
                <Th right>Зарезервированные встречи</Th>
                <Th right>Общая сумма покупок</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {data.most_active_students.length === 0 ? (
                <EmptyRow span={5} />
              ) : (
                data.most_active_students.map((s) => (
                  <tr key={s.id}>
                    <Td>{s.id}</Td>
                    <Td>{s.name ?? '—'}</Td>
                    <Td right>{num(s.purchased_classes)}</Td>
                    <Td right>{num(s.reserved_appointments)}</Td>
                    <Td right>{num(s.total_cost)} C</Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Panel>
      </div>
    </PanelLayout>
  )
}
