import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { InstructorQuizzesPage } from '#/pages/instructor-quizzes/ui/InstructorQuizzesPage'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
  useRouterState: () => '/instructor/quizzes',
  useNavigate: () => vi.fn(),
}))

const dashboard = {
  quiz_results_count: 1,
  passed_count: 1,
  waiting_count: 0,
  success_rate: 100,
  avg_grade: 100,
  quizzes: [
    {
      id: 3,
      title: 'База банана',
      course_id: 9,
      chapter_id: null,
      description: null,
      pass_mark: 100,
      attempt: null,
      time: 0,
      expiry_days: null,
      display_questions_randomly: false,
      total_mark: 100,
      question_count: 1,
      students_count: 0,
      status: 'active',
      certificate: false,
      created_at: new Date().toISOString(),
    },
  ],
  results: [{ id: 1, user: { id: 1, full_name: 'Ученик' }, quiz_id: 3, quiz_title: 'База банана', user_grade: 100, status: 'passed', created_at: '' }],
}

vi.mock('@tanstack/react-query', () => ({
  useQuery: (opts: { queryKey?: unknown[] }) => {
    const key = opts.queryKey?.[0]
    if (key === 'instructor-quizzes') {
      return { data: dashboard, isPending: false, isError: false, error: null }
    }
    if (key === 'instructor-classes') {
      return { data: [{ id: 9, title: 'De Dust2' }], isPending: false, isError: false, error: null }
    }
    return {
      data: { enrolled_count: 0, courses_count: 1, following_count: 0 },
      isPending: false,
      isError: false,
      error: null,
    }
  },
}))

vi.mock('#/features/manage-course', () => ({ classesQueryOptions: { queryKey: ['instructor-classes'] } }))
vi.mock('#/features/manage-quiz', () => ({
  quizResultsQueryOptions: { queryKey: ['instructor-quizzes'] },
  useDeleteQuiz: () => ({ mutate: vi.fn(), isPending: false }),
}))
vi.mock('#/entities/dashboard', () => ({ dashboardQueryOptions: { queryKey: ['dashboard'] } }))
vi.mock('#/entities/session', () => ({
  useSessionStore: (sel: (s: unknown) => unknown) => sel({ user: { role_name: 'teacher' } }),
}))

afterEach(cleanup)

describe('InstructorQuizzesPage', () => {
  it('renders the quiz list with stats and a status badge', () => {
    render(<InstructorQuizzesPage />)
    expect(screen.getAllByText('Список тестов').length).toBeGreaterThan(0)
    expect(screen.getByText('База банана')).toBeTruthy()
    expect(screen.getByText('De Dust2')).toBeTruthy()
    expect(screen.getByText('Активно')).toBeTruthy()
  })
})
