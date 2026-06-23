import { describe, expect, it } from 'vitest'

import { loginSchema } from '#/features/auth/login/model/schema'

describe('loginSchema', () => {
  it('accepts a valid email and password', () => {
    expect(loginSchema.safeParse({ email: 'a@b.tj', password: 'secret12' }).success).toBe(true)
  })

  it('rejects an invalid email', () => {
    expect(loginSchema.safeParse({ email: 'nope', password: 'secret12' }).success).toBe(false)
  })

  it('rejects a short password', () => {
    expect(loginSchema.safeParse({ email: 'a@b.tj', password: '123' }).success).toBe(false)
  })
})
