import { beforeEach, describe, expect, it } from 'vitest'

import { useSessionStore, type User } from '#/entities/session'

const user: User = {
  id: 1,
  email: 'a@aiacademy.tj',
  mobile: null,
  full_name: 'A',
  role_name: 'user',
  status: 'active',
  verified: true,
  avatar: null,
  created_at: '2026-01-01T00:00:00Z',
}

describe('session store', () => {
  beforeEach(() => useSessionStore.getState().logout())

  it('starts unauthenticated', () => {
    expect(useSessionStore.getState().token).toBeNull()
    expect(useSessionStore.getState().user).toBeNull()
  })

  it('setAuth stores token and user', () => {
    useSessionStore.getState().setAuth('tok123', user)
    expect(useSessionStore.getState().token).toBe('tok123')
    expect(useSessionStore.getState().user?.email).toBe('a@aiacademy.tj')
  })

  it('setUser updates the user without touching the token', () => {
    useSessionStore.getState().setAuth('tok123', user)
    useSessionStore.getState().setUser({ ...user, full_name: 'B' })
    expect(useSessionStore.getState().token).toBe('tok123')
    expect(useSessionStore.getState().user?.full_name).toBe('B')
  })

  it('logout clears token and user', () => {
    useSessionStore.getState().setAuth('tok123', user)
    useSessionStore.getState().logout()
    expect(useSessionStore.getState().token).toBeNull()
    expect(useSessionStore.getState().user).toBeNull()
  })
})
