import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AdminCourseFormPage } from '#/pages/admin-course-form/ui/AdminCourseFormPage'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
  useNavigate: () => vi.fn(),
}))

vi.mock('@tanstack/react-query', () => ({
  useQuery: (opts: { queryKey?: unknown[] }) => {
    const key = opts.queryKey?.[0]
    if (key === 'admin-course-teachers') {
      return { data: [{ id: 1047, full_name: 'Самсонов Александр' }] }
    }
    return { data: [{ id: 1, title: 'Программирование' }] }
  },
}))

vi.mock('#/entities/category', () => ({ categoriesQueryOptions: { queryKey: ['categories'] } }))
vi.mock('#/features/manage-course', () => ({
  courseTeachersQueryOptions: { queryKey: ['admin-course-teachers'] },
  useCreateCourse: () => ({ mutate: vi.fn(), isPending: false, isError: false, error: null }),
  useUploadCourseMedia: () => ({ mutate: vi.fn(), isPending: false }),
}))
vi.mock('#/widgets/panel-layout', () => ({
  PanelLayout: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

afterEach(cleanup)

describe('AdminCourseFormPage', () => {
  it('renders the single-page form with all legacy sections', () => {
    render(<AdminCourseFormPage />)
    expect(screen.getAllByText('Новый курс').length).toBeGreaterThan(0)
    expect(screen.getByText('Основная информация')).toBeTruthy()
    expect(screen.getByText('Дополнительная информация')).toBeTruthy()
    expect(screen.getByText('Сообщение рецензенту')).toBeTruthy()
    expect(screen.getByText('Выбрать инструктора')).toBeTruthy()
    expect(screen.getByText('Сохранить и продолжить')).toBeTruthy()
  })

  it('shows the instructor and category options', () => {
    render(<AdminCourseFormPage />)
    expect(screen.getByText('Самсонов Александр')).toBeTruthy()
    expect(screen.getByText('Программирование')).toBeTruthy()
  })
})
