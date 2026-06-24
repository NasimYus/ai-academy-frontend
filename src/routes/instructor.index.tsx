import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { InstructorPage } from '#/pages/instructor'

export const Route = createFileRoute('/instructor/')({
  beforeLoad: () => requireAuth(),
  component: InstructorPage,
})
