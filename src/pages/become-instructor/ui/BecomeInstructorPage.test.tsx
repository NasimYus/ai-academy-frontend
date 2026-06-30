import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { BecomeInstructorPage } from '#/pages/become-instructor/ui/BecomeInstructorPage'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
  useRouterState: () => '/become-instructor',
}))

const state: { role: string; request: unknown } = { role: 'user', request: null }

vi.mock('@tanstack/react-query', () => ({
  useQuery: (opts: { queryKey?: unknown[] }) => {
    const key = opts.queryKey?.[0]
    if (key === 'become-instructor') {
      return { data: state.request, isPending: false, isError: false, error: null }
    }
    if (key === 'categories') {
      return { data: [{ id: 1, title: 'AI' }], isPending: false, isError: false, error: null }
    }
    return {
      data: { enrolled_count: 0, courses_count: 0, following_count: 0 },
      isPending: false,
      isError: false,
      error: null,
    }
  },
}))

vi.mock('#/entities/become-instructor', () => ({
  myBecomeInstructorQueryOptions: { queryKey: ['become-instructor'] },
}))
vi.mock('#/entities/category', () => ({ categoriesQueryOptions: { queryKey: ['categories'] } }))
vi.mock('#/entities/dashboard', () => ({ dashboardQueryOptions: { queryKey: ['dashboard'] } }))
vi.mock('#/entities/session', () => ({
  useSessionStore: (sel: (s: unknown) => unknown) => sel({ user: { role_name: state.role } }),
}))
vi.mock('#/features/become-instructor', () => ({
  useSubmitBecomeInstructor: () => ({
    mutate: vi.fn(),
    isPending: false,
    isError: false,
    isSuccess: false,
  }),
}))

afterEach(() => {
  state.role = 'user'
  state.request = null
  cleanup()
})

describe('BecomeInstructorPage', () => {
  it('shows the application form to a student with no request', () => {
    render(<BecomeInstructorPage />)
    expect(screen.getByText('Заявка на роль инструктора')).toBeTruthy()
    expect(screen.getByText('AI')).toBeTruthy() // occupation chip from categories
  })

  it('tells an existing instructor they already have the role', () => {
    state.role = 'teacher'
    render(<BecomeInstructorPage />)
    expect(screen.getByText('Вы уже инструктор')).toBeTruthy()
  })

  it('shows a pending state when a request is under review', () => {
    state.request = { id: 1, role: 'teacher', occupations: [], status: 'pending', created_at: '' }
    render(<BecomeInstructorPage />)
    expect(screen.getByText('Заявка на рассмотрении')).toBeTruthy()
  })
})
