import { createFileRoute } from '@tanstack/react-router'

import { requireRole } from '#/entities/session'
import { AdminCoursesPage } from '#/pages/admin-courses'

export const Route = createFileRoute('/admin/courses')({
  beforeLoad: () => requireRole('admin'),
  component: AdminCoursesPage,
})
