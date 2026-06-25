import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { InstructorQuizzesPage } from '#/pages/instructor-quizzes'

export const Route = createFileRoute('/instructor/quizzes')({
  beforeLoad: () => requireAuth(),
  component: InstructorQuizzesPage,
})
