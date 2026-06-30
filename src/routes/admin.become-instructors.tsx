import { createFileRoute } from '@tanstack/react-router'

import { requireRole } from '#/entities/session'
import { AdminBecomeInstructorsPage } from '#/pages/admin-become-instructors'

export const Route = createFileRoute('/admin/become-instructors')({
  beforeLoad: () => requireRole('admin'),
  component: AdminBecomeInstructorsPage,
})
