import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { InstructorBundlesPage } from '#/pages/instructor-bundles'

export const Route = createFileRoute('/instructor/bundles')({
  beforeLoad: () => requireAuth(),
  component: InstructorBundlesPage,
})
