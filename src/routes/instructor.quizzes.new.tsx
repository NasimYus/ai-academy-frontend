import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { QuizFormPage } from '#/pages/instructor-quiz-form'

export const Route = createFileRoute('/instructor/quizzes/new')({
  beforeLoad: () => requireAuth(),
  component: QuizFormPage,
})
