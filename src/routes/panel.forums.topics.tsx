import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { MyForumTopicsPage } from '#/pages/community-forum'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/panel/forums/topics')({
  beforeLoad: () => requireAuth(),
  component: withPanel(MyForumTopicsPage),
})
