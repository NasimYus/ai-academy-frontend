import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { AssignmentPage } from '#/pages/assignment'

export const Route = createFileRoute('/assignment/$assignmentId')({
  beforeLoad: () => requireAuth(),
  validateSearch: (search: Record<string, unknown>): { slug?: string } => ({
    slug: typeof search.slug === 'string' ? search.slug : undefined,
  }),
  component: AssignmentRoute,
})

function AssignmentRoute() {
  const { assignmentId } = Route.useParams()
  const { slug } = Route.useSearch()
  return <AssignmentPage assignmentId={Number(assignmentId)} slug={slug} />
}
