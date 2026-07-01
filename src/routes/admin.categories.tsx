import { createFileRoute } from '@tanstack/react-router'

import { requireRole } from '#/entities/session'
import { AdminCategoriesPage } from '#/pages/admin-categories'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/admin/categories')({
  beforeLoad: () => requireRole('admin'),
  component: withPanel(AdminCategoriesPage),
})
