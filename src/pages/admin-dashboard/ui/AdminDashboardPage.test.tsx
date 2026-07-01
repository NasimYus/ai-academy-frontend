import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AdminDashboardPage } from '#/pages/admin-dashboard/ui/AdminDashboardPage'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}))

const dashboard = {
  daily_sales_by_type: { webinars: 2, courses: 1, appointments: 0, total: 3 },
  income: { today: 10, month: 100, year: 1000, total: 5000 },
  sales_counts: { today: 1, month: 5, year: 40, total: 120 },
  new_sales: 4,
  new_comments: 7,
  new_tickets: 2,
  pending_reviews: 3,
  sales_chart_year: { labels: ['Янв', 'Фев'], data: [10, 20] },
  sales_chart_month: { labels: ['1', '2'], data: [1, 2] },
  sales_stats: {
    today: { amount: 10, grow_percent: '0%', grow_status: 'up' },
    week: { amount: 50, grow_percent: '0%', grow_status: 'up' },
    month: { amount: 100, grow_percent: '0%', grow_status: 'up' },
    year: { amount: 1000, grow_percent: '12%', grow_status: 'up' },
  },
  recent_comments: [{ id: 1, user_name: 'Иван', comment: 'Отличный курс', created_at: '' }],
  recent_tickets: [],
  recent_tickets_pending: 0,
  recent_webinars: [
    { id: 1, title: 'Вебинар по Python', teacher_name: 'Пётр', status: 'pending' },
  ],
  recent_webinars_pending: 1,
  recent_courses: [],
  recent_courses_pending: 0,
  users_chart: { labels: ['1', '2', '3'], data: [1, 2, 3] },
}

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: dashboard, isPending: false, isError: false, error: null }),
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}))

vi.mock('#/entities/admin-dashboard', () => ({
  adminDashboardQueryOptions: { queryKey: ['admin-dashboard'] },
}))
vi.mock('#/entities/session', () => ({
  useSessionStore: (sel: (s: unknown) => unknown) =>
    sel({ user: { full_name: 'Админ Админов', role_name: 'admin' } }),
}))
vi.mock('#/widgets/panel-layout', () => ({
  PanelLayout: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

afterEach(cleanup)

describe('AdminDashboardPage', () => {
  it('renders the dashboard with the welcome hero and metric sections', () => {
    render(<AdminDashboardPage />)
    expect(screen.getByText('Панель управления')).toBeTruthy()
    expect(screen.getByText(/Добро пожаловать, Админ Админов/)).toBeTruthy()
    expect(screen.getByText('Ежедневные продажи по типу курса')).toBeTruthy()
    expect(screen.getByText('Доход платформы')).toBeTruthy()
  })

  it('shows recent comments and pending course rows', () => {
    render(<AdminDashboardPage />)
    expect(screen.getByText('Отличный курс')).toBeTruthy()
    expect(screen.getByText('Вебинар по Python')).toBeTruthy()
    expect(screen.getByText('Ожидание')).toBeTruthy()
  })
})
