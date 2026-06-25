import { describe, expect, it } from 'vitest'

import { buyMessage } from '#/features/buy-bundle/api/buy'

describe('buyMessage', () => {
  it('maps known bundle purchase codes', () => {
    expect(buyMessage('not_free')).toBe('Набор платный')
    expect(buyMessage('already_purchased')).toBe('У вас уже есть доступ к набору')
    expect(buyMessage('no_enough_points')).toBe('Недостаточно баллов')
    expect(buyMessage('no_points')).toBe('Этот набор нельзя купить за баллы')
  })

  it('falls back for unknown / non-string details', () => {
    expect(buyMessage('zzz')).toBe('Не удалось оформить набор')
    expect(buyMessage(undefined)).toBe('Не удалось оформить набор')
  })
})
