import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { InstructorMeetingsPage } from '#/pages/instructor-meetings'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/instructor/meetings')({
  beforeLoad: () => requireAuth(),
  component: withPanel(InstructorMeetingsPage),
})
