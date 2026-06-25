import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { InstructorCommentsPage } from '#/pages/instructor-comments'

export const Route = createFileRoute('/instructor/comments')({
  beforeLoad: () => requireAuth(),
  component: InstructorCommentsPage,
})
