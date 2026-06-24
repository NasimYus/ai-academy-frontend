import { Link } from '@tanstack/react-router'

import { useSessionStore } from '#/entities/session'
import { useLogout } from '#/features/auth/logout'
import { AppSettings } from '#/features/app-settings'
import { NotificationBell } from '#/features/notifications'

export function Header() {
  const token = useSessionStore((s) => s.token)
  const user = useSessionStore((s) => s.user)
  const logout = useLogout()

  return (
    <header className="border-b border-brand-100 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="AI Academy" className="h-8 w-auto" />
          </Link>
          <nav className="hidden gap-4 text-sm text-ink/70 sm:flex">
            <Link to="/courses" className="hover:text-brand-600">
              Курсы
            </Link>
            <Link to="/instructors" className="hover:text-brand-600">
              Преподаватели
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <AppSettings />
          {token && (
            <>
              <Link
                to="/certificates"
                className="hidden text-ink/60 hover:text-brand-600 sm:inline"
              >
                Сертификаты
              </Link>
              <Link to="/my-courses" className="hidden text-ink/60 hover:text-brand-600 sm:inline">
                Мои курсы
              </Link>
              <Link to="/favorites" className="hidden text-ink/60 hover:text-brand-600 sm:inline">
                Избранное
              </Link>
              <Link to="/cart" className="text-ink/60 hover:text-brand-600">
                Корзина
              </Link>
              <NotificationBell />
              <Link to="/orders" className="hidden text-ink/60 hover:text-brand-600 sm:inline">
                Заказы
              </Link>
              <Link to="/support" className="hidden text-ink/60 hover:text-brand-600 sm:inline">
                Поддержка
              </Link>
              <Link to="/profile" className="hidden text-ink/60 hover:text-brand-600 sm:inline">
                {user?.email}
              </Link>
              <button
                onClick={() => void logout()}
                className="rounded-lg border border-brand-200 px-3 py-1.5 font-medium text-brand-700 transition hover:bg-brand-50"
              >
                Выйти
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
