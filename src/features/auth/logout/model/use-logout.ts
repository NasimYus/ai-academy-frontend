import { useNavigate } from '@tanstack/react-router'

import { useSessionStore } from '#/entities/session'
import { logout as logoutRequest } from '#/features/auth/logout/api/logout'

// Calls the server logout, then clears the local session and redirects.
export function useLogout() {
  const navigate = useNavigate()
  const clearSession = useSessionStore((s) => s.logout)

  return async () => {
    try {
      await logoutRequest()
    } catch {
      /* best-effort: clear the local session regardless */
    }
    clearSession()
    navigate({ to: '/login' })
  }
}
