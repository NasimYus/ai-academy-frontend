import { createFileRoute, redirect } from '@tanstack/react-router'

import { useSessionStore } from '#/entities/session'

export const Route = createFileRoute('/')({
  beforeLoad: () => {
    throw redirect({ to: useSessionStore.getState().token ? '/courses' : '/login' })
  },
})
