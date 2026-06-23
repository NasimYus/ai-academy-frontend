import { redirect } from '@tanstack/react-router'

import { useSessionStore } from '#/entities/session/model/store'

// Route guards for `beforeLoad`. Reading the store outside React is fine here.

export function requireAuth(): void {
  if (!useSessionStore.getState().token) {
    throw redirect({ to: '/login' })
  }
}

// Mirrors the backend role/level access — gate a route to specific role names.
export function requireRole(...roles: Array<string>): void {
  const { token, user } = useSessionStore.getState()
  if (!token) throw redirect({ to: '/login' })
  if (!user || !roles.includes(user.role_name)) {
    throw redirect({ to: '/' })
  }
}
