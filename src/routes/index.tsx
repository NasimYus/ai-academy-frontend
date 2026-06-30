import { createFileRoute, redirect } from '@tanstack/react-router'

import { useSessionStore } from '#/entities/session'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    // Authenticated users go to their cabinet; guests to the login screen.
    throw redirect({ to: useSessionStore.getState().token ? '/panel' : '/login' })
  },
})
