import { useQuery } from '@tanstack/react-query'
import { Link, useRouterState } from '@tanstack/react-router'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'

import { dashboardQueryOptions } from '#/entities/dashboard'
import { useSessionStore } from '#/entities/session'
import { Avatar } from '#/shared/ui'

import { MENU } from '#/widgets/panel-layout/model/menu'
import type { MenuGroup } from '#/widgets/panel-layout/model/menu'

const isActive = (pathname: string, to: string) =>
  to === '/panel' ? pathname === '/panel' : pathname === to || pathname.startsWith(`${to}/`)

// Avatar counters cloned from the legacy sidebar: a student sees purchased
// courses + who they follow; instructors see created courses + followers (the
// follower count isn't migrated yet, so it falls back to following).
function SidebarCounters() {
  const isStudent = useSessionStore((s) => s.user?.role_name === 'user')
  const { data } = useQuery(dashboardQueryOptions)
  const courses = isStudent ? (data?.enrolled_count ?? 0) : (data?.courses_count ?? 0)
  const following = data?.following_count ?? 0
  return (
    <div className="mt-3 flex items-center justify-around rounded-xl bg-brand-50/70 px-2 py-2.5">
      <div className="flex flex-col items-center">
        <span className="text-sm font-bold text-ink">{courses}</span>
        <span className="text-xs text-ink/50">Курсы</span>
      </div>
      <span className="h-8 w-px bg-brand-100" />
      <div className="flex flex-col items-center">
        <span className="text-sm font-bold text-ink">{following}</span>
        <span className="text-xs text-ink/50">Подписки</span>
      </div>
    </div>
  )
}

function SidebarGroup({
  group,
  role,
  pathname,
  onNavigate,
}: {
  group: MenuGroup
  role?: string
  pathname: string
  onNavigate?: () => void
}) {
  const items = (group.items ?? []).filter((i) => !i.roles || (role && i.roles.includes(role)))
  const itemActive = items.some((i) => isActive(pathname, i.to))
  const groupActive = itemActive || (group.to ? isActive(pathname, group.to) : false)
  const [override, setOverride] = useState<boolean | null>(null)

  // A group whose items are all role-gated away for this user is hidden.
  if (group.items?.length && items.length === 0) return null

  // Plain link (no sub-items).
  if (!items.length) {
    return (
      <Link
        to={group.to ?? '#'}
        onClick={onNavigate}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
          groupActive ? 'bg-brand-50 font-medium text-brand-700' : 'text-ink/70 hover:bg-brand-50/60'
        }`}
      >
        <group.icon className="size-[18px] shrink-0" strokeWidth={1.8} />
        <span>{group.label}</span>
      </Link>
    )
  }

  const expanded = override ?? groupActive
  return (
    <div>
      <button
        type="button"
        onClick={() => setOverride(!expanded)}
        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
          groupActive ? 'font-medium text-brand-700' : 'text-ink/70 hover:bg-brand-50/60'
        }`}
      >
        <group.icon className="size-[18px] shrink-0" strokeWidth={1.8} />
        <span className="flex-1 text-left">{group.label}</span>
        <ChevronDown
          className={`size-4 shrink-0 text-ink/40 transition ${expanded ? '' : '-rotate-90'}`}
        />
      </button>
      {expanded && (
        <ul className="mt-0.5 space-y-0.5 pl-7">
          {items.map((item) => {
            const active = isActive(pathname, item.to)
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={onNavigate}
                  className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition ${
                    active
                      ? 'font-medium text-brand-700'
                      : 'text-ink/55 hover:bg-brand-50/60 hover:text-ink/80'
                  }`}
                >
                  <span
                    className={`size-1.5 shrink-0 rounded-full ${active ? 'bg-brand-500' : 'bg-ink/20'}`}
                  />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function SidebarNav({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  const role = useSessionStore((s) => s.user?.role_name)
  return (
    <nav className="space-y-6">
      {MENU.filter((section) => !section.roles || (role && section.roles.includes(role))).map(
        (section) => (
          <div key={section.title}>
            <p className="px-3 pb-2 text-xs font-bold uppercase tracking-wide text-ink/35">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.groups.map((group) => (
                <SidebarGroup
                  key={group.label}
                  group={group}
                  role={role}
                  pathname={pathname}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        ),
      )}
    </nav>
  )
}

export function PanelLayout({ children }: { children: ReactNode }) {
  const user = useSessionStore((s) => s.user)
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-brand-50/30">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-6 rounded-2xl border border-brand-100 bg-white p-4">
            <div className="mb-5 border-b border-brand-50 pb-4 text-center">
              <Avatar name={user?.full_name} size={56} className="mx-auto" />
              <p className="mt-2 truncate font-display font-bold text-ink">
                {user?.full_name ?? 'Профиль'}
              </p>
              <SidebarCounters />
            </div>
            <SidebarNav pathname={pathname} />
          </div>
        </aside>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="fixed bottom-5 right-5 z-30 rounded-full bg-brand-500 px-4 py-3 text-white shadow-lg lg:hidden"
          aria-label="Меню кабинета"
        >
          ☰
        </button>
        {open && (
          <div className="fixed inset-0 z-20 lg:hidden" onClick={() => setOpen(false)}>
            <div className="absolute inset-0 bg-ink/40" />
            <div
              className="absolute left-0 top-0 h-full w-72 overflow-y-auto bg-white p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-5 border-b border-brand-50 pb-4 text-center">
                <Avatar name={user?.full_name} size={56} className="mx-auto" />
                <p className="mt-2 truncate font-display font-bold text-ink">
                  {user?.full_name ?? 'Профиль'}
                </p>
                <SidebarCounters />
              </div>
              <SidebarNav pathname={pathname} onNavigate={() => setOpen(false)} />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
