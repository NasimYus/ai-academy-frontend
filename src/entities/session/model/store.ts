import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { setAuthTokenGetter } from '#/shared/api'
import type { components } from '#/shared/api'

export type User = components['schemas']['UserRead']

interface SessionState {
  token: string | null
  user: User | null
  setAuth: (token: string, user: User) => void
  setUser: (user: User) => void
  logout: () => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: (token, user) => set({ token, user }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: 'ai-academy-auth' },
  ),
)

// Bridge the API client's auth header to the persisted session token.
// Dependency injection keeps `shared/api` decoupled from this entity.
setAuthTokenGetter(() => useSessionStore.getState().token)
