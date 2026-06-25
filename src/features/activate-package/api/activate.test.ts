import { describe, expect, it } from 'vitest'

import { activateMessage } from '#/features/activate-package/api/activate'

describe('activateMessage', () => {
  it('maps known gate codes', () => {
    expect(activateMessage('not_free')).toBe('Этот пакет платный')
    expect(activateMessage('wrong_role')).toBe('Пакет не для вашей роли')
  })

  it('falls back for unknown / non-string details', () => {
    expect(activateMessage('x')).toBe('Не удалось активировать пакет')
    expect(activateMessage(undefined)).toBe('Не удалось активировать пакет')
  })
})
