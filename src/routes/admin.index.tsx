import { createFileRoute } from '@tanstack/react-router'

import { requireRole } from '#/entities/session'
import { AdminDashboardPage } from '#/pages/admin-dashboard'

export const Route = createFileRoute('/admin/')({
  beforeLoad: () => requireRole('admin'),
  component: AdminDashboardPage,
})
