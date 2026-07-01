import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AdminCoursesManagePage } from '#/pages/admin-courses-manage/ui/AdminCoursesManagePage'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}))

const manage = {
  total_courses: 2,
  total_pending: 1,
  total_duration: 14640, // 244:00
  total_sales: 2,
  page: 1,
  per_page: 10,
  total: 2,
  courses: [
    {
      id: 2024,
      title: 'AI Foundations: Python',
      type: 'course',
      status: 'pending',
      category_name: 'Additional Courses',
      teacher_id: 1047,
      teacher_name: 'Самсонов Александр',
      price: 350,
      is_free: false,
      capacity: 28,
      duration: 120,
      sales_count: 2,
      students_count: 2,
      income: 700,
      created_at: '2026-01-29T22:22:00Z',
      updated_at: '2026-04-26T16:51:00Z',
    },
    {
      id: 2025,
      title: 'De Dust2',
      type: 'course',
      status: 'is_draft',
      category_name: 'Main Courses',
      teacher_id: 1047,
      teacher_name: 'Самсонов Александр',
      price: 0,
      is_free: true,
      capacity: 10,
      duration: 0,
      sales_count: 0,
      students_count: 0,
      income: 0,
      created_at: '2026-03-26T07:19:00Z',
      updated_at: '2026-04-26T16:53:00Z',
    },
  ],
}

vi.mock('@tanstack/react-query', () => ({
  useQuery: (opts: { queryKey?: unknown[] }) => {
    const key = opts.queryKey?.[0]
    if (key === 'admin-courses-manage') {
      return { data: manage, isPending: false, isError: false, error: null }
    }
    return { data: [{ id: 1, title: 'Main Courses' }], isPending: false, isError: false, error: null }
  },
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}))

vi.mock('#/entities/admin-course-manage', () => ({
  adminCoursesManageQueryOptions: () => ({ queryKey: ['admin-courses-manage'] }),
}))
vi.mock('#/entities/category', () => ({
  categoriesQueryOptions: { queryKey: ['categories'] },
}))
vi.mock('#/features/moderate-courses', () => ({
  useApproveCourse: () => ({ mutate: vi.fn(), isPending: false }),
  useRejectCourse: () => ({ mutate: vi.fn(), isPending: false }),
  useUnpublishCourse: () => ({ mutate: vi.fn(), isPending: false }),
  useDeleteCourse: () => ({ mutate: vi.fn(), isPending: false }),
}))
vi.mock('#/widgets/panel-layout', () => ({
  PanelLayout: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

afterEach(cleanup)

describe('AdminCoursesManagePage', () => {
  it('renders headline stats and course rows for the type', () => {
    render(<AdminCoursesManagePage courseType="course" title="Курсы" />)
    expect(screen.getByText('Курсы — список')).toBeTruthy()
    expect(screen.getByText('244:00 Часы')).toBeTruthy()
    expect(screen.getByText('AI Foundations: Python')).toBeTruthy()
    expect(screen.getByText('De Dust2')).toBeTruthy()
    expect(screen.getByText('Бесплатно')).toBeTruthy()
    // "Ожидание"/"Черновик" appear both as a filter option and as a status badge
    expect(screen.getAllByText('Ожидание').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Черновик').length).toBeGreaterThan(0)
  })
})
