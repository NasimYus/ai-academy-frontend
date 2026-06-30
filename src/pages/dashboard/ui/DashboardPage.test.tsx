import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { DashboardPage } from '#/pages/dashboard/ui/DashboardPage'

// The page composes PanelLayout (router) + a dashboard query + the session store.
// Mock those boundaries so the test exercises the dashboard markup itself.
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
  useRouterState: () => '/panel',
}))

const fixture = {
  is_instructor: false,
  enrolled_count: 0,
  purchases_count: 0,
  favorites_count: 0,
  meetings_count: 2,
  certificates_count: 1,
  passed_quizzes_count: 3,
  balance: 0,
  courses_count: 0,
  sales_count: 0,
  sales_income: 0,
  meeting_requests_count: 0,
}

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: fixture, isPending: false, isError: false, error: null }),
}))

// Avoid pulling the real queryOptions/openapi client into the test.
vi.mock('#/entities/dashboard', () => ({ dashboardQueryOptions: {} }))

vi.mock('#/entities/session', () => ({
  useSessionStore: (sel: (s: unknown) => unknown) =>
    sel({ user: { full_name: 'Иван Студент', email: 'ivan@aiacademy.tj', role_name: 'user' } }),
}))

afterEach(cleanup)

describe('DashboardPage (student)', () => {
  it('greets the user and shows hello-box counters', () => {
    render(<DashboardPage />)
    expect(screen.getByText(/Привет, Иван Студент/)).toBeTruthy()
    expect(screen.getByText('Сданные тесты')).toBeTruthy()
    // passed_quizzes_count value
    expect(screen.getByText('3')).toBeTruthy()
  })

  it('renders legacy empty states when the student has no activity', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Нет курсов!')).toBeTruthy()
    expect(screen.getByText('Задания отсутствуют!')).toBeTruthy()
    expect(screen.getByText('Пока нет активности!')).toBeTruthy()
    expect(screen.getByText('Нет тестов!')).toBeTruthy()
    expect(screen.getByText('Нет уведомлений!')).toBeTruthy()
    expect(screen.getByText('Нужна помощь по курсу?')).toBeTruthy()
  })

  it('shows the wallet card with no balance', () => {
    render(<DashboardPage />)
    expect(screen.getByText('Текущий баланс')).toBeTruthy()
    expect(screen.getByText('Нет баланса')).toBeTruthy()
  })
})
