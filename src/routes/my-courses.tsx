import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { MyCoursesPage } from '#/pages/my-courses'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/my-courses')({
  beforeLoad: () => requireAuth(),
  component: withPanel(MyCoursesPage),
})
