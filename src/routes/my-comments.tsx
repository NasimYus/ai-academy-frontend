import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { MyCommentsPage } from '#/pages/my-comments'

export const Route = createFileRoute('/my-comments')({
  beforeLoad: () => requireAuth(),
  component: MyCommentsPage,
})
