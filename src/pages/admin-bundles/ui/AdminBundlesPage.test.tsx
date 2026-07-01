import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AdminBundlesPage } from '#/pages/admin-bundles/ui/AdminBundlesPage'

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}))

const list = {
  total: 1,
  bundles: [
    {
      id: 7,
      title: 'Fullstack Pack',
      status: 'active',
      teacher_id: 1047,
      teacher_name: 'Самсонов Александр',
      category: 'Программирование',
      price: 500,
      webinars_count: 3,
      created_at: '2026-01-01T00:00:00Z',
    },
  ],
}

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: list, isPending: false, isError: false, error: null }),
  useQueryClient: () => ({ invalidateQueries: vi.fn() }),
}))

vi.mock('#/features/manage-bundle', () => ({
  adminBundlesQueryOptions: { queryKey: ['admin-bundles'] },
  useDeleteBundle: () => ({ mutate: vi.fn(), isPending: false }),
}))
vi.mock('#/widgets/panel-layout', () => ({
  PanelLayout: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

afterEach(cleanup)

describe('AdminBundlesPage', () => {
  it('renders the bundle list with course count and status', () => {
    render(<AdminBundlesPage />)
    expect(screen.getAllByText('Пакеты курсов').length).toBeGreaterThan(0)
    expect(screen.getByText('Fullstack Pack')).toBeTruthy()
    expect(screen.getByText('Самсонов Александр')).toBeTruthy()
    expect(screen.getByText('Активен')).toBeTruthy()
  })
})
