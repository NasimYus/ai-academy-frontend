import { createFileRoute } from '@tanstack/react-router'

import { requireRole } from '#/entities/session'
import { InstructorSalesPage } from '#/pages/instructor-sales'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/instructor/sales')({
  beforeLoad: () => requireRole('teacher', 'organization'),
  component: withPanel(InstructorSalesPage),
})
