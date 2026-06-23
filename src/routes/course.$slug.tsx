import { createFileRoute } from '@tanstack/react-router'

import { CoursePage } from '#/pages/course'

// Public, like the legacy guest route `courses/{id}`.
export const Route = createFileRoute('/course/$slug')({
  component: CoursePage,
})
