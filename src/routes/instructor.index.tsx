import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { InstructorPage } from '#/pages/instructor'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/instructor/')({
  beforeLoad: () => requireAuth(),
  component: withPanel(InstructorPage),
})
