import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { InstructorAssignmentsPage } from '#/pages/instructor-assignments'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/instructor/assignments')({
  beforeLoad: () => requireAuth(),
  component: withPanel(InstructorAssignmentsPage),
})
