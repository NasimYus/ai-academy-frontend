import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { QuizPage } from '#/pages/quiz'

export const Route = createFileRoute('/quiz/$quizId')({
  beforeLoad: () => requireAuth(),
  validateSearch: (search: Record<string, unknown>): { slug?: string } => ({
    slug: typeof search.slug === 'string' ? search.slug : undefined,
  }),
  component: QuizRoute,
})

function QuizRoute() {
  const { quizId } = Route.useParams()
  const { slug } = Route.useSearch()
  return <QuizPage quizId={Number(quizId)} slug={slug} />
}
