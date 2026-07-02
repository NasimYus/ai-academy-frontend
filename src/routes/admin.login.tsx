import { createFileRoute, redirect } from '@tanstack/react-router'

import { useSessionStore } from '#/entities/session'
import { AdminLoginPage } from '#/pages/admin-login'

export const Route = createFileRoute('/admin/login')({
  beforeLoad: () => {
    // Already an admin? Skip straight to the admin area.
    const { user } = useSessionStore.getState()
    if (user?.role_name === 'admin') {
      throw redirect({ to: '/admin/courses' })
    }
  },
  component: AdminLoginPage,
})
