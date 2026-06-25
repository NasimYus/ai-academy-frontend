import { describe, expect, it } from 'vitest'

import { subscribeMessage } from '#/features/subscribe/api/subscribe'

describe('subscribeMessage', () => {
  it('maps known subscription gate codes', () => {
    expect(subscribeMessage('not_free')).toBe('Этот план платный')
    expect(subscribeMessage('not_subscribable')).toBe('Курс недоступен по подписке')
    expect(subscribeMessage('no_active_subscribe')).toBe('У вас нет активной подписки')
    expect(subscribeMessage('already_purchased')).toBe('У вас уже есть доступ к курсу')
  })

  it('falls back for unknown / non-string details', () => {
    expect(subscribeMessage('???')).toBe('Не удалось выполнить операцию')
    expect(subscribeMessage(undefined)).toBe('Не удалось выполнить операцию')
  })
})
