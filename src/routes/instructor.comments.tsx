import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { InstructorCommentsPage } from '#/pages/instructor-comments'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/instructor/comments')({
  beforeLoad: () => requireAuth(),
  component: withPanel(InstructorCommentsPage),
})
