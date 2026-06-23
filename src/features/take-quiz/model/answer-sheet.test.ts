import { describe, expect, it } from 'vitest'

import { gateMessage } from '#/features/take-quiz/api/take-quiz'
import { buildAnswerSheet } from '#/features/take-quiz/model/answer-sheet'

describe('buildAnswerSheet', () => {
  it('maps the answer map to legacy answer_sheet items', () => {
    expect(buildAnswerSheet({ 1: 42, 2: 'free text' })).toEqual([
      { question_id: 1, answer: 42 },
      { question_id: 2, answer: 'free text' },
    ])
  })

  it('returns an empty sheet when nothing is answered', () => {
    expect(buildAnswerSheet({})).toEqual([])
  })
})

describe('gateMessage', () => {
  it('maps known start-gate codes to messages', () => {
    expect(gateMessage('not_purchased')).toBe('Запишитесь на курс, чтобы пройти тест')
    expect(gateMessage('passed')).toBe('Вы уже прошли этот тест')
    expect(gateMessage('max_attempt')).toBe('Исчерпаны попытки прохождения')
  })

  it('falls back for unknown / non-string details', () => {
    expect(gateMessage('boom')).toBe('Не удалось начать тест')
    expect(gateMessage(undefined)).toBe('Не удалось начать тест')
  })
})
