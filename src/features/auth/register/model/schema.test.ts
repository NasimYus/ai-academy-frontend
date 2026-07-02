import { describe, expect, it } from 'vitest'

import {
  registerStep1Schema,
  registerStep3Schema,
} from '#/features/auth/register/model/schema'

describe('registerStep1Schema', () => {
  it('accepts a strong matching password', () => {
    const r = registerStep1Schema.safeParse({
      email: 'a@b.tj',
      password: 'Secret123!',
      password_confirmation: 'Secret123!',
    })
    expect(r.success).toBe(true)
  })

  it('rejects mismatched passwords', () => {
    const r = registerStep1Schema.safeParse({
      email: 'a@b.tj',
      password: 'Secret123!',
      password_confirmation: 'Other123!',
    })
    expect(r.success).toBe(false)
  })

  it('rejects a weak password (no symbol / too short)', () => {
    expect(
      registerStep1Schema.safeParse({
        email: 'a@b.tj',
        password: 'secret12345',
        password_confirmation: 'secret12345',
      }).success,
    ).toBe(false)
    expect(
      registerStep1Schema.safeParse({
        email: 'a@b.tj',
        password: '12345',
        password_confirmation: '12345',
      }).success,
    ).toBe(false)
  })
})

describe('registerStep3Schema', () => {
  it('requires a full name of at least 3 chars', () => {
    expect(registerStep3Schema.safeParse({ full_name: 'Al' }).success).toBe(false)
    expect(registerStep3Schema.safeParse({ full_name: 'Alice' }).success).toBe(true)
  })
})
