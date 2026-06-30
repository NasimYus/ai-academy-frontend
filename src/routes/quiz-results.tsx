import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { QuizResultsPage } from '#/pages/quiz-results'

export const Route = createFileRoute('/quiz-results')({
  beforeLoad: () => requireAuth(),
  component: QuizResultsPage,
})
