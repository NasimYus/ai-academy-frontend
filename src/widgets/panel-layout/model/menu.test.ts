import { describe, expect, it } from 'vitest'

import { MENU } from '#/widgets/panel-layout/model/menu'

const visibleFor = (role: string | undefined) =>
  MENU.filter((s) => !s.roles || (role && s.roles.includes(role)))

describe('panel sidebar menu', () => {
  it('shows only learning + account sections to a plain student', () => {
    const titles = visibleFor('user').map((s) => s.title)
    expect(titles).toContain('Обучение')
    expect(titles).toContain('Аккаунт')
    expect(titles).not.toContain('Преподавание')
    expect(titles).not.toContain('Администрирование')
  })

  it('reveals teaching to instructors and admin section only to admin', () => {
    expect(visibleFor('teacher').map((s) => s.title)).toContain('Преподавание')
    expect(visibleFor('teacher').map((s) => s.title)).not.toContain('Администрирование')
    expect(visibleFor('admin').map((s) => s.title)).toContain('Администрирование')
  })

  it('always includes the dashboard link first', () => {
    expect(MENU[0].items[0].to).toBe('/panel')
  })
})
