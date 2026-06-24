import { describe, expect, it } from 'vitest'

import { manageMessage } from '#/features/manage-course/api/manage'

describe('manageMessage', () => {
  it('maps known validation codes', () => {
    expect(manageMessage('category_not_found')).toBe('Категория не найдена')
    expect(manageMessage('start_date_required')).toBe('Для вебинара укажите дату старта')
  })

  it('falls back for unknown / non-string details', () => {
    expect(manageMessage('boom')).toBe('Не удалось сохранить курс')
    expect(manageMessage(undefined)).toBe('Не удалось сохранить курс')
  })
})
