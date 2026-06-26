import { createFileRoute } from '@tanstack/react-router'

import { requireRole } from '#/entities/session'
import { AdminCoursesPage } from '#/pages/admin-courses'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/admin/courses')({
  beforeLoad: () => requireRole('admin'),
  component: withPanel(AdminCoursesPage),
})
