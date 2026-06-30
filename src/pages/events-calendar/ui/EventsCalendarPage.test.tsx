import { cleanup, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { EventsCalendarPage } from '#/pages/events-calendar/ui/EventsCalendarPage'

// EventsCalendarPage composes PanelLayout (router + dashboard query + session)
// and its own events-calendar query. Mock those boundaries; switch the query
// result on the queryKey so both useQuery call-sites get the right fixture.
vi.mock('@tanstack/react-router', () => ({
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
  useRouterState: () => '/calendar',
}))

const state: { events: { type: string; subtitle: string; event_at: string; time: string | null }[] } = {
  events: [],
}

vi.mock('@tanstack/react-query', () => ({
  useQuery: (opts: { queryKey?: unknown[] }) => {
    if (opts.queryKey?.[0] === 'events-calendar') {
      return {
        data: { events: state.events, total: state.events.length },
        isPending: false,
        isError: false,
        error: null,
      }
    }
    return {
      data: { enrolled_count: 0, courses_count: 0, following_count: 0 },
      isPending: false,
      isError: false,
      error: null,
    }
  },
}))

vi.mock('#/entities/events-calendar', () => ({
  eventsCalendarQueryOptions: { queryKey: ['events-calendar'] },
}))
vi.mock('#/entities/dashboard', () => ({ dashboardQueryOptions: { queryKey: ['dashboard'] } }))
vi.mock('#/entities/session', () => ({
  useSessionStore: (sel: (s: unknown) => unknown) =>
    sel({ user: { full_name: 'Иван Студент', role_name: 'user' } }),
}))

afterEach(() => {
  state.events = []
  cleanup()
})

describe('EventsCalendarPage', () => {
  it('shows the empty state when there are no events', () => {
    render(<EventsCalendarPage />)
    // title appears in the page header and the sidebar menu item
    expect(screen.getAllByText('Календарь событий').length).toBeGreaterThan(0)
    expect(screen.getByText('Выберите дату')).toBeTruthy()
    expect(screen.getByText('События не найдены!')).toBeTruthy()
    expect(screen.getByText('Нет предстоящих событий')).toBeTruthy()
  })

  it('lists an upcoming event by its legacy label', () => {
    state.events = [
      { type: 'meetings', subtitle: 'Анна П.', event_at: new Date().toISOString(), time: '10:00' },
    ]
    render(<EventsCalendarPage />)
    // appears both in the day list (today is selected) and the upcoming panel
    expect(screen.getAllByText('Встреча').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Анна П.').length).toBeGreaterThan(0)
  })
})
