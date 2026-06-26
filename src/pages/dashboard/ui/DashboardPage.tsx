import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { dashboardQueryOptions } from '#/entities/dashboard'
import { useSessionStore } from '#/entities/session'
import { Card, PageHeader, Spinner, StatCard } from '#/shared/ui'
import { PanelLayout } from '#/widgets/panel-layout'

export function DashboardPage() {
  const user = useSessionStore((s) => s.user)
  const { data, isPending, isError, error } = useQuery(dashboardQueryOptions)

  return (
    <PanelLayout>
      <PageHeader
        title={`Здравствуйте, ${user?.full_name ?? 'студент'}!`}
        subtitle="Сводка вашего обучения и активности"
      />

      {isPending ? (
        <Spinner />
      ) : isError ? (
        <p className="text-red-600">{error.message}</p>
      ) : (
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 font-display text-lg font-bold text-ink">Обучение</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard label="Мои курсы" value={data.enrolled_count} icon="🎓" />
              <StatCard label="Покупки" value={data.purchases_count} icon="🧾" />
              <StatCard label="Избранное" value={data.favorites_count} icon="♥" />
            </div>
          </section>

          {data.is_instructor && (
            <section>
              <h2 className="mb-3 font-display text-lg font-bold text-ink">Преподавание</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <StatCard label="Курсов создано" value={data.courses_count} icon="📚" />
                <StatCard label="Продаж" value={data.sales_count} icon="💰" />
                <StatCard
                  label="Доход"
                  value={data.sales_income.toLocaleString('ru-RU')}
                  icon="📈"
                />
                <StatCard label="Заявки на консультации" value={data.meeting_requests_count} icon="🗓" />
              </div>
            </section>
          )}

          <section>
            <h2 className="mb-3 font-display text-lg font-bold text-ink">Быстрый переход</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { to: '/my-courses', label: 'Продолжить обучение' },
                { to: '/orders', label: 'Мои заказы' },
                { to: '/certificates', label: 'Сертификаты' },
                ...(data.is_instructor
                  ? [
                      { to: '/instructor', label: 'Управление курсами' },
                      { to: '/instructor/sales', label: 'Отчёт по продажам' },
                    ]
                  : []),
              ].map((q) => (
                <Link key={q.to} to={q.to}>
                  <Card className="p-4 text-sm font-medium text-brand-700 transition hover:border-brand-300 hover:shadow-sm">
                    {q.label} →
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}
    </PanelLayout>
  )
}
