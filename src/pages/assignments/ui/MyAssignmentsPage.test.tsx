import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { MyAssignmentsPage } from '#/pages/assignments/ui/MyAssignmentsPage'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
  useRouterState: () => '/assignments',
}))

const state: { rows: unknown[] } = { rows: [] }

vi.mock('@tanstack/react-query', () => ({
  useQuery: (opts: { queryKey?: unknown[] }) => {
    if (opts.queryKey?.[0] === 'my-assignments') {
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

vi.mock('#/entities/assignment', () => ({ myAssignmentsQueryOptions: { queryKey: ['my-assignments'] } }))
vi.mock('#/entities/dashboard', () => ({ dashboardQueryOptions: { queryKey: ['dashboard'] } }))
vi.mock('#/entities/session', () => ({
  useSessionStore: (sel: (s: unknown) => unknown) => sel({ user: { role_name: 'user' } }),
}))

afterEach(() => {
  state.rows = []
  cleanup()
})

describe('MyAssignmentsPage', () => {
  it('renders the legacy empty state', () => {
    render(<MyAssignmentsPage />)
    expect(screen.getByText('Задания отсутствуют!')).toBeTruthy()
  })

  it('lists submission threads', () => {
    state.rows = [
      {
        id: 1,
        assignment_id: 7,
        title: 'Эссе по ML',
        course_title: 'Введение в ML',
        student: {},
        user_status: 'pending',
      },
    ]
    render(<MyAssignmentsPage />)
    expect(screen.getByText('Эссе по ML')).toBeTruthy()
    expect(screen.getByText('На проверке')).toBeTruthy()
  })
})
