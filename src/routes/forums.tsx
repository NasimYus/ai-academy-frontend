import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { ForumsPage } from '#/pages/community-forum'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/forums')({
  beforeLoad: () => requireAuth(),
  component: withPanel(ForumsPage),
})
