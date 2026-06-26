import { createFileRoute } from '@tanstack/react-router'

import { requireRole } from '#/entities/session'
import { AdminReviewsPage } from '#/pages/admin-reviews'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/admin/reviews')({
  beforeLoad: () => requireRole('admin'),
  component: withPanel(AdminReviewsPage),
})
