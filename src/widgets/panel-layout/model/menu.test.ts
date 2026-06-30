import { describe, expect, it } from 'vitest'

import { MENU } from '#/widgets/panel-layout/model/menu'

const visibleFor = (role: string | undefined) =>
  MENU.filter((s) => !s.roles || (role && s.roles.includes(role)))

describe('panel sidebar menu', () => {
  it('shows learning + account sections to a plain student, not staff ones', () => {
    const titles = visibleFor('user').map((s) => s.title)
    expect(titles).toContain('Образование')
    expect(titles).toContain('Оценка')
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
    expect(MENU[0].groups[0].to).toBe('/panel')
  })

  it('Курсы group exposes the legacy sub-links', () => {
    const education = MENU.find((s) => s.title === 'Образование')
    const courses = education?.groups.find((g) => g.label === 'Курсы')
    expect(courses?.items?.map((i) => i.to)).toEqual(['/purchases', '/my-comments', '/favorites'])
  })
})
