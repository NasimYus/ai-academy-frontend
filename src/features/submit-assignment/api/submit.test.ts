import { describe, expect, it } from 'vitest'

import { submitMessage } from '#/features/submit-assignment/api/submit'

describe('submitMessage', () => {
  it('maps known submit-gate codes to messages', () => {
    expect(submitMessage('not_purchased')).toBe('Запишитесь на курс, чтобы отправлять работы')
    expect(submitMessage('assignment_deadline_or_attempts')).toBe(
      'Срок сдачи истёк или исчерпаны попытки',
    )
  })

  it('falls back for unknown / non-string details', () => {
    expect(submitMessage('whatever')).toBe('Не удалось отправить работу')
    expect(submitMessage(null)).toBe('Не удалось отправить работу')
  })
})
