import { describe, expect, it } from 'vitest'

import { buildCreateBody, buildStepBody, initialForm } from '#/features/manage-course/ui/wizard/config'

describe('wizard config — teacher assignment (admin)', () => {
  it('omits teacher_id (null) when none is chosen', () => {
    const f = initialForm()
    expect(buildCreateBody(f, true).teacher_id).toBeNull()
    expect(buildStepBody(1, f).teacher_id).toBeNull()
  })

  it('carries the chosen instructor id into create + step-1 bodies', () => {
    const f = { ...initialForm(), teacher_id: '1047' }
    expect(buildCreateBody(f, false).teacher_id).toBe(1047)
    expect(buildStepBody(1, f).teacher_id).toBe(1047)
  })
})
