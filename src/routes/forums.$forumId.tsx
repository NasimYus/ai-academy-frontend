import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { ForumCategoryPage } from '#/pages/community-forum'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/forums/$forumId')({
  beforeLoad: () => requireAuth(),
  component: withPanel(CategoryRoute),
})

function CategoryRoute() {
  const { forumId } = Route.useParams()
  return <ForumCategoryPage forumId={Number(forumId)} />
}
