import { describe, expect, it } from 'vitest'

import { subscribeMessage } from '#/features/newsletter-subscribe/api/subscribe'

describe('subscribeMessage', () => {
  it('maps the duplicate code to a message', () => {
    expect(subscribeMessage('already_subscribed')).toBe('Этот email уже подписан')
  })

  it('falls back for unknown / non-string details', () => {
    expect(subscribeMessage('nope')).toBe('Не удалось подписаться')
    expect(subscribeMessage(undefined)).toBe('Не удалось подписаться')
  })
})
