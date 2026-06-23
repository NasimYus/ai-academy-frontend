import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { LearnPage } from '#/pages/learn'

export const Route = createFileRoute('/learn/$slug')({
  beforeLoad: () => requireAuth(),
  component: LearnRoute,
})

function LearnRoute() {
  const { slug } = Route.useParams()
  return <LearnPage slug={slug} />
}
