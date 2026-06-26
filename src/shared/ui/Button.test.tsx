import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Button } from '#/shared/ui/Button'

afterEach(cleanup)

describe('Button', () => {
  it('renders children and fires onClick', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Купить</Button>)
    screen.getByRole('button', { name: 'Купить' }).click()
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('applies the danger variant classes', () => {
    render(<Button variant="danger">X</Button>)
    expect(screen.getByRole('button').className).toContain('bg-red-600')
  })

  it('honours disabled', () => {
    render(<Button disabled>D</Button>)
    expect(screen.getByRole('button').hasAttribute('disabled')).toBe(true)
  })
})
