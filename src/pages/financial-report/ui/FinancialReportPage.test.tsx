import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { FinancialReportPage } from '#/pages/financial-report/ui/FinancialReportPage'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
  useRouterState: () => '/finance',
}))

const state: { rows: { id: number; amount: number; type: string; type_account: string; description: string | null; created_at: string }[] } =
  { rows: [] }

vi.mock('@tanstack/react-query', () => ({
  useQuery: (opts: { queryKey?: unknown[] }) => {
    if (opts.queryKey?.[0] === 'accounting') {
      return { data: state.rows, isPending: false, isError: false, error: null }
    }
    return {
      data: { enrolled_count: 0, courses_count: 0, following_count: 0 },
      isPending: false,
      isError: false,
      error: null,
    }
  },
}))

vi.mock('#/entities/financial', () => ({ accountingQueryOptions: { queryKey: ['accounting'] } }))
vi.mock('#/entities/dashboard', () => ({ dashboardQueryOptions: { queryKey: ['dashboard'] } }))
vi.mock('#/entities/session', () => ({
  useSessionStore: (sel: (s: unknown) => unknown) => sel({ user: { role_name: 'user' } }),
}))

afterEach(() => {
  state.rows = []
  cleanup()
})

describe('FinancialReportPage', () => {
  it('shows the empty state with no documents', () => {
    render(<FinancialReportPage />)
    expect(screen.getByText('Финансовые документы')).toBeTruthy()
    expect(screen.getByText('Документов нет!')).toBeTruthy()
  })

  it('renders a credit row with a signed amount', () => {
    state.rows = [
      {
        id: 1,
        amount: 350,
        type: 'addiction',
        type_account: 'asset',
        description: 'Offline Payment Approved',
        created_at: new Date().toISOString(),
      },
    ]
    render(<FinancialReportPage />)
    expect(screen.getByText('Offline Payment Approved')).toBeTruthy()
    expect(screen.getByText('+350')).toBeTruthy()
  })
})
