import { createFileRoute } from '@tanstack/react-router'

import { requireRole } from '#/entities/session'
import { AdminCoursesManagePage } from '#/pages/admin-courses-manage'

export const Route = createFileRoute('/admin/courses-list')({
  beforeLoad: () => requireRole('admin'),
  component: () => <AdminCoursesManagePage courseType="course" title="Курсы" />,
})
