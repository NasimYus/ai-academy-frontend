import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { BecomeInstructorPage } from '#/pages/become-instructor'

export const Route = createFileRoute('/become-instructor')({
  beforeLoad: () => requireAuth(),
  component: BecomeInstructorPage,
})
