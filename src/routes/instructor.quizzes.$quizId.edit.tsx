import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { QuizFormPage } from '#/pages/instructor-quiz-form'

export const Route = createFileRoute('/instructor/quizzes/$quizId/edit')({
  beforeLoad: () => requireAuth(),
  component: EditQuizRoute,
})

function EditQuizRoute() {
  const { quizId } = Route.useParams()
  return <QuizFormPage quizId={Number(quizId)} />
}
