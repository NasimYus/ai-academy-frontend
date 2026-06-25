import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { InstructorMeetingsPage } from '#/pages/instructor-meetings'

export const Route = createFileRoute('/instructor/meetings')({
  beforeLoad: () => requireAuth(),
  component: InstructorMeetingsPage,
})
