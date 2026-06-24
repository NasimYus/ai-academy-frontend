import { describe, expect, it } from 'vitest'

import { redeemMessage } from '#/features/redeem-points/api/redeem'

describe('redeemMessage', () => {
  it('maps known redeem/exchange gate codes', () => {
    expect(redeemMessage('no_enough_points')).toBe('Недостаточно баллов')
    expect(redeemMessage('already_purchased')).toBe('У вас уже есть доступ к курсу')
    expect(redeemMessage('free')).toBe('Курс бесплатный')
    expect(redeemMessage('rewards_disabled')).toBe('Программа баллов отключена')
  })

  it('falls back for unknown / non-string details', () => {
    expect(redeemMessage('xyz')).toBe('Не удалось выполнить операцию')
    expect(redeemMessage(null)).toBe('Не удалось выполнить операцию')
  })
})
