import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { CoursesPage } from '#/pages/courses'

export const Route = createFileRoute('/courses')({
  beforeLoad: () => requireAuth(),
  component: CoursesPage,
})
