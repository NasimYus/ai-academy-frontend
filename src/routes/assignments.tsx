import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { MyAssignmentsPage } from '#/pages/assignments'

export const Route = createFileRoute('/assignments')({
  beforeLoad: () => requireAuth(),
  component: MyAssignmentsPage,
})
