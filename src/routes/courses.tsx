import { createFileRoute, redirect } from '@tanstack/react-router'

import { useSessionStore } from '#/entities/session'
import { CoursesPage } from '#/pages/courses'

export const Route = createFileRoute('/courses')({
  beforeLoad: () => {
    if (!useSessionStore.getState().token) {
      throw redirect({ to: '/login' })
    }
  },
  component: CoursesPage,
})
