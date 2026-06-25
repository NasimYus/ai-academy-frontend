import { createFileRoute } from '@tanstack/react-router'

import { requireRole } from '#/entities/session'
import { AdminUsersPage } from '#/pages/admin-users'

export const Route = createFileRoute('/admin/users')({
  beforeLoad: () => requireRole('admin'),
  component: AdminUsersPage,
})
