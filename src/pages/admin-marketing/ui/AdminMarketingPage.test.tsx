import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AdminMarketingPage } from '#/pages/admin-marketing/ui/AdminMarketingPage'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}))

const marketing = {
  users_without_purchases: 24,
  teachers_without_class: 1,
  featured_classes: 0,
  active_discounts: 0,
  classes_statistics: { labels: ['webinar', 'course', 'text_lesson'], data: [0, 100, 0] },
  net_profit_chart_year: { labels: ['Янв', 'Фев'], data: [0, 0] },
  net_profit_chart_month: { labels: ['01', '02'], data: [0, 0] },
  net_profit_stats: {
    today: { amount: 0, grow_percent: 'No previous value', grow_status: 'up' },
    week: { amount: 0, grow_percent: 'No previous value', grow_status: 'up' },
    month: { amount: 0, grow_percent: 'No previous value', grow_status: 'up' },
    year: { amount: 0, grow_percent: 'No previous value', grow_status: 'up' },
  },
  top_selling_classes: [],
  top_selling_appointments: [],
  top_selling_teachers: [
    { id: 1047, name: 'Самсонов Александр', classes_duration: 0, sales_count: 2, sales_amount: 700 },
  ],
  top_selling_organizations: [],
  most_active_students: [
    { id: 1050, name: 'Tabrez', purchased_classes: 1, reserved_appointments: 0, total_cost: 350 },
  ],
}

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: marketing, isPending: false, isError: false, error: null }),
}))

vi.mock('#/entities/admin-marketing', () => ({
  adminMarketingQueryOptions: { queryKey: ['admin-marketing'] },
}))
vi.mock('#/widgets/panel-layout', () => ({
  PanelLayout: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

afterEach(cleanup)

describe('AdminMarketingPage', () => {
  it('renders the marketing counters and course-type legend', () => {
    render(<AdminMarketingPage />)
    expect(screen.getByText('Маркетинговая панель')).toBeTruthy()
    expect(screen.getByText('Пользователи без покупок')).toBeTruthy()
    expect(screen.getByText('24')).toBeTruthy()
    expect(screen.getByText('Типы курсов')).toBeTruthy()
    expect(screen.getByText('Курс')).toBeTruthy()
  })

  it('renders top-seller and active-student rows', () => {
    render(<AdminMarketingPage />)
    expect(screen.getByText('Самсонов Александр')).toBeTruthy()
    expect(screen.getByText('Tabrez')).toBeTruthy()
    expect(screen.getByText('Самые активные студенты')).toBeTruthy()
  })
})
