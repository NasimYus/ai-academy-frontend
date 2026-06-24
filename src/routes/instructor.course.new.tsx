import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { CourseFormPage } from '#/pages/instructor'

export const Route = createFileRoute('/instructor/course/new')({
  beforeLoad: () => requireAuth(),
  component: CourseFormPage,
})
