import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { MyForumPostsPage } from '#/pages/community-forum'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/panel/forums/posts')({
  beforeLoad: () => requireAuth(),
  component: withPanel(MyForumPostsPage),
})
