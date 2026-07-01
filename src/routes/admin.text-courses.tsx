import { createFileRoute } from '@tanstack/react-router'

import { requireRole } from '#/entities/session'
import { AdminCoursesManagePage } from '#/pages/admin-courses-manage'

export const Route = createFileRoute('/admin/text-courses')({
  beforeLoad: () => requireRole('admin'),
  component: () => <AdminCoursesManagePage courseType="text_lesson" title="Текстовые курсы" />,
})
