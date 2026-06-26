import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { InstructorBundlesPage } from '#/pages/instructor-bundles'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/instructor/bundles')({
  beforeLoad: () => requireAuth(),
  component: withPanel(InstructorBundlesPage),
})
