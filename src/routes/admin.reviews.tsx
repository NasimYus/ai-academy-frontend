import { createFileRoute } from '@tanstack/react-router'

import { requireRole } from '#/entities/session'
import { AdminReviewsPage } from '#/pages/admin-reviews'

export const Route = createFileRoute('/admin/reviews')({
  beforeLoad: () => requireRole('admin'),
  component: AdminReviewsPage,
})
