import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { ForumTopicPage } from '#/pages/community-forum'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/forum-topics/$slug')({
  beforeLoad: () => requireAuth(),
  component: withPanel(TopicRoute),
})

function TopicRoute() {
  const { slug } = Route.useParams()
  return <ForumTopicPage slug={slug} />
}
