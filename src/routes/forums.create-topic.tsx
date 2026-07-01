import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { NewTopicPage } from '#/pages/community-forum'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/forums/create-topic')({
  beforeLoad: () => requireAuth(),
  component: withPanel(NewTopicPage),
})
