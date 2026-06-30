import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { QuizOpensPage } from '#/pages/quiz-opens'

export const Route = createFileRoute('/quiz-opens')({
  beforeLoad: () => requireAuth(),
  component: QuizOpensPage,
})
