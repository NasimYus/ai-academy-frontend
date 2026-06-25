import { createFileRoute } from '@tanstack/react-router'

import { requireRole } from '#/entities/session'
import { InstructorSalesPage } from '#/pages/instructor-sales'

export const Route = createFileRoute('/instructor/sales')({
  beforeLoad: () => requireRole('teacher', 'organization'),
  component: InstructorSalesPage,
})
