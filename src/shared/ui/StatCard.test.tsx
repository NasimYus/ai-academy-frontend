import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { StatCard } from '#/shared/ui/StatCard'

afterEach(cleanup)

describe('StatCard', () => {
  it('shows label and value', () => {
    render(<StatCard label="Продаж" value={42} />)
    expect(screen.getByText('Продаж')).toBeTruthy()
    expect(screen.getByText('42')).toBeTruthy()
  })
})
