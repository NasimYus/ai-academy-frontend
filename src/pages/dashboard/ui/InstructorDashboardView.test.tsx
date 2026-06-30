import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { InstructorDashboardView } from '#/pages/dashboard/ui/InstructorDashboardView'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}))

const fixture = {
  courses_count: 2,
  meetings_count: 0,
  products_count: 0,
  bundles_count: 0,
  live_courses: 1,
  video_courses: 1,
  text_courses: 0,
  manage_courses: [
    { id: 7, title: 'AI Foundations', slug: 'ai', type: 'course', image: null, students_count: 2 },
  ],
}

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: fixture, isPending: false, isError: false, error: null }),
}))
vi.mock('#/entities/dashboard', () => ({ instructorDashboardQueryOptions: { queryKey: ['x'] } }))

afterEach(cleanup)

describe('InstructorDashboardView', () => {
  it('shows the instructor counters and a course-management card', () => {
    render(<InstructorDashboardView name="Иван" balance={500} />)
    expect(screen.getByText(/Привет, Иван/)).toBeTruthy()
    expect(screen.getByText('Управление курсами')).toBeTruthy()
    expect(screen.getByText('AI Foundations')).toBeTruthy()
    expect(screen.getByText('2 студентов')).toBeTruthy()
    expect(screen.getByText('500C')).toBeTruthy()
  })
})
