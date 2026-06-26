import { Link } from '@tanstack/react-router'

import { useSessionStore } from '#/entities/session'
import { AppSettings } from '#/features/app-settings'
import { useLogout } from '#/features/auth/logout'
import { NotificationBell } from '#/features/notifications'
import { Avatar, Button } from '#/shared/ui'

const NAV = [
  { to: '/courses', label: 'Курсы' },
  { to: '/instructors', label: 'Преподаватели' },
  { to: '/blog', label: 'Блог' },
  { to: '/store', label: 'Магазин' },
] as const

export function Header() {
  const token = useSessionStore((s) => s.token)
  const user = useSessionStore((s) => s.user)
  const logout = useLogout()

  return (
    <header className="sticky top-0 z-20 border-b border-brand-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-7">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="AI Academy" className="h-8 w-auto" />
          </Link>
          <nav className="hidden gap-5 text-sm font-medium text-ink/70 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="transition hover:text-brand-600"
                activeProps={{ className: 'text-brand-700' }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <AppSettings />
          {token ? (
            <>
              <NotificationBell />
              <Link
                to="/cart"
                title="Корзина"
                className="rounded-lg p-2 text-ink/60 transition hover:bg-brand-50 hover:text-brand-600"
                aria-label="Корзина"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
                </svg>
              </Link>
              <Link to="/panel">
                <Button size="sm" variant="outline">
                  Кабинет
                </Button>
              </Link>
              <Link to="/profile" title={user?.email ?? 'Профиль'} className="ml-1">
                <Avatar name={user?.full_name} size={34} />
              </Link>
              <Button size="sm" variant="ghost" onClick={() => void logout()}>
                Выйти
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button size="sm" variant="ghost">
                  Войти
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Регистрация</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
