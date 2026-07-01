import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AdminLiveSessionsPage } from '#/pages/admin-live-sessions/ui/AdminLiveSessionsPage'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}))

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({
    data: { page: 1, per_page: 10, total: 0, sessions: [] },
    isPending: false,
    isError: false,
    error: null,
  }),
}))

vi.mock('#/entities/admin-course-manage', () => ({
  adminLiveSessionsQueryOptions: () => ({ queryKey: ['admin-live-sessions'] }),
}))
vi.mock('#/widgets/panel-layout', () => ({
  PanelLayout: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

afterEach(cleanup)

describe('AdminLiveSessionsPage', () => {
  it('renders the live-sessions table with an empty state', () => {
    render(<AdminLiveSessionsPage />)
    expect(screen.getAllByText('История живых сессий').length).toBeGreaterThan(0)
    expect(screen.getByText('Прямая сессия')).toBeTruthy()
    expect(screen.getByText('Живых сессий пока нет')).toBeTruthy()
  })
})
