import { createFileRoute } from '@tanstack/react-router'

import { requireRole } from '#/entities/session'
import { AdminCourseFormPage } from '#/pages/admin-course-form'

export const Route = createFileRoute('/admin/course/new')({
  beforeLoad: () => requireRole('admin'),
  component: AdminCourseFormPage,
})
