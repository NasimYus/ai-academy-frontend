import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { InstructorAssignmentsPage } from '#/pages/instructor-assignments'

export const Route = createFileRoute('/instructor/assignments')({
  beforeLoad: () => requireAuth(),
  component: InstructorAssignmentsPage,
})
