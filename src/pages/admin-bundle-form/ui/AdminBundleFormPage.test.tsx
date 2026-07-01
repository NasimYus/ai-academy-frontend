import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AdminBundleFormPage } from '#/pages/admin-bundle-form/ui/AdminBundleFormPage'

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
  useUploadCourseMedia: () => ({ mutate: vi.fn(), isPending: false }),
}))
vi.mock('#/features/manage-bundle', () => ({
  useCreateBundle: () => ({ mutate: vi.fn(), isPending: false, isError: false, error: null }),
}))
vi.mock('#/widgets/panel-layout', () => ({
  PanelLayout: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

afterEach(cleanup)

describe('AdminBundleFormPage', () => {
  it('renders the single-page bundle form with legacy sections', () => {
    render(<AdminBundleFormPage />)
    expect(screen.getAllByText('Новый пакет курсов').length).toBeGreaterThan(0)
    expect(screen.getByText('Основная информация')).toBeTruthy()
    expect(screen.getByText('Необходимые баллы')).toBeTruthy()
    expect(screen.getByText('Сертификат о завершении')).toBeTruthy()
    expect(screen.getByText('Сообщение рецензенту')).toBeTruthy()
    expect(screen.getByText('Сохранить и продолжить')).toBeTruthy()
  })
})
