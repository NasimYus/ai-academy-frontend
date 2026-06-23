import { describe, expect, it } from 'vitest'

import {
  registerStep1Schema,
  registerStep3Schema,
} from '#/features/auth/register/model/schema'

describe('registerStep1Schema', () => {
  it('accepts matching passwords', () => {
    const r = registerStep1Schema.safeParse({
      email: 'a@b.tj',
      password: 'secret6',
      password_confirmation: 'secret6',
    })
    expect(r.success).toBe(true)
  })

  it('rejects mismatched passwords', () => {
    const r = registerStep1Schema.safeParse({
      email: 'a@b.tj',
      password: 'secret6',
      password_confirmation: 'other6',
    })
    expect(r.success).toBe(false)
  })

  it('rejects a short password', () => {
    const r = registerStep1Schema.safeParse({
      email: 'a@b.tj',
      password: '12345',
      password_confirmation: '12345',
    })
    expect(r.success).toBe(false)
  })
})

describe('registerStep3Schema', () => {
  it('requires a full name of at least 3 chars', () => {
    expect(registerStep3Schema.safeParse({ full_name: 'Al' }).success).toBe(false)
    expect(registerStep3Schema.safeParse({ full_name: 'Alice' }).success).toBe(true)
  })
})
