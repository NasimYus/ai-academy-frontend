import { afterEach, describe, expect, it } from 'vitest'

import { requireAuth, requireRole, useSessionStore } from '#/entities/session'
import type { User } from '#/entities/session'

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

describe('route guards', () => {
  afterEach(() => useSessionStore.getState().logout())

  it('requireAuth throws when unauthenticated', () => {
    expect(() => requireAuth()).toThrow()
  })

  it('requireAuth passes when a token is present', () => {
    useSessionStore.getState().setAuth('tok', user)
    expect(() => requireAuth()).not.toThrow()
  })

  it('requireRole allows a matching role', () => {
    useSessionStore.getState().setAuth('tok', user)
    expect(() => requireRole('user', 'admin')).not.toThrow()
  })

  it('requireRole rejects a non-matching role', () => {
    useSessionStore.getState().setAuth('tok', user)
    expect(() => requireRole('admin')).toThrow()
  })
})
