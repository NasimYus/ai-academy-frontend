import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { CourseFormPage } from '#/pages/instructor'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/instructor/course/new')({
  beforeLoad: () => requireAuth(),
  component: withPanel(CourseFormPage),
})
