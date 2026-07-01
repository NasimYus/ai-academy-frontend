import { createFileRoute } from '@tanstack/react-router'

import { requireRole } from '#/entities/session'
import { AdminCoursesManagePage } from '#/pages/admin-courses-manage'

export const Route = createFileRoute('/admin/online-courses')({
  beforeLoad: () => requireRole('admin'),
  component: () => <AdminCoursesManagePage courseType="webinar" title="Онлайн курсы" />,
})
