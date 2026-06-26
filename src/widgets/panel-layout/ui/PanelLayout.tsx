import { Link, useRouterState } from '@tanstack/react-router'
import { useState } from 'react'
import type { ReactNode } from 'react'

import { useSessionStore } from '#/entities/session'
import { Avatar } from '#/shared/ui'

import { MENU } from '#/widgets/panel-layout/model/menu'

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
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active =
                  item.to === '/panel'
                    ? pathname === '/panel'
                    : pathname === item.to || pathname.startsWith(`${item.to}/`)
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      onClick={onNavigate}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                        active
                          ? 'bg-brand-50 font-medium text-brand-700'
                          : 'text-ink/70 hover:bg-brand-50/60'
                      }`}
                    >
                      <span className="w-5 text-center">{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
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
            <div className="mb-5 flex items-center gap-3 border-b border-brand-50 pb-4">
              <Avatar name={user?.full_name} size={40} />
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink">{user?.full_name ?? 'Профиль'}</p>
                <p className="truncate text-xs text-ink/45">{user?.email}</p>
              </div>
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
              <SidebarNav pathname={pathname} onNavigate={() => setOpen(false)} />
            </div>
          </div>
        )}

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
