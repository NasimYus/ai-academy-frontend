import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { InstructorCourseAssignmentsPage } from '#/pages/instructor-course-assignments'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/instructor/assignments/courses')({
  beforeLoad: () => requireAuth(),
  component: withPanel(InstructorCourseAssignmentsPage),
})
