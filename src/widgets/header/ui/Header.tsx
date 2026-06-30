import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { LayoutGrid, Mail, Phone, Search, ShoppingCart, Sparkles } from 'lucide-react'
import { useState } from 'react'

import { categoriesQueryOptions } from '#/entities/category'
import { useSessionStore } from '#/entities/session'
import { AppSettings } from '#/features/app-settings'
import { useLogout } from '#/features/auth/logout'
import { NotificationBell } from '#/features/notifications'
import { Avatar, Button } from '#/shared/ui'

// Guest navbar links — parity of the legacy theme header (Home / Courses /
// Forums / News / Contact). Categories is a dropdown rendered separately.
const NAV = [
  { to: '/', label: 'Home' },
  { to: '/courses', label: 'Courses' },
  // TODO(Forums): global forum is a separate subsystem (topics/posts/likes) —
  // deferred; interim target is the catalog where per-course forums live.
  { to: '/courses', label: 'Forums' },
  { to: '/blog', label: 'News' },
  { to: '/contact', label: 'Contact' },
] as const

function CategoriesMenu() {
  const [open, setOpen] = useState(false)
  const { data: categories } = useQuery(categoriesQueryOptions)
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-brand-700"
      >
        <LayoutGrid className="size-4" strokeWidth={1.8} />
        Categories
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-20 mt-2 max-h-96 w-64 overflow-y-auto rounded-xl border border-brand-100 bg-white p-2 shadow-lg">
            {categories && categories.length > 0 ? (
              categories.map((c) => (
                <Link
                  key={c.id}
                  to="/courses"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink/70 transition hover:bg-brand-50 hover:text-brand-700"
                >
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: c.color ?? 'var(--color-brand-400)' }}
                  />
                  {c.title}
                </Link>
              ))
            ) : (
              <p className="px-3 py-2 text-sm text-ink/40">Нет категорий</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export function Header() {
  const token = useSessionStore((s) => s.token)
  return token ? <AuthedHeader /> : <GuestHeader />
}

function GuestHeader() {
  return (
    <header className="sticky top-0 z-30">
      {/* Utility bar */}
      <div className="bg-brand-600 pb-12 text-sm text-white/90">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-2.5">
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <Phone className="size-4" strokeWidth={1.8} />
              +992 99 555 00 32
            </span>
            <span className="hidden items-center gap-1.5 sm:flex">
              <Mail className="size-4" strokeWidth={1.8} />
              ai.academy@zypl.ai
            </span>
          </div>

          <label className="relative hidden flex-1 justify-center md:flex">
            <span className="relative w-full max-w-sm">
              <input
                placeholder="Search…"
                className="w-full rounded-full bg-white/95 px-4 py-1.5 pr-9 text-sm text-ink outline-none placeholder:text-ink/40"
              />
              <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-ink/40" />
            </span>
          </label>

          <div className="flex items-center gap-4">
            <AppSettings />
            <Link to="/cart" aria-label="Корзина" className="transition hover:text-white">
              <ShoppingCart className="size-5" strokeWidth={1.8} />
            </Link>
            <Link to="/login" className="font-medium transition hover:text-white">
              Login
            </Link>
            <Link to="/register" className="font-medium transition hover:text-white">
              Register
            </Link>
          </div>
        </div>
      </div>

      {/* Floating nav card */}
      <div className="mx-auto -mt-9 max-w-6xl px-4">
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-brand-100 bg-white px-5 py-3 shadow-sm">
          <Link to="/" className="flex items-center">
            <img src="/logo.png" alt="AI Academy" className="h-8 w-auto" />
          </Link>

          <nav className="hidden items-center gap-1 text-sm font-medium text-ink/70 lg:flex">
            <CategoriesMenu />
            {NAV.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="rounded-lg px-3 py-1.5 transition hover:text-brand-600"
                activeProps={{ className: 'text-brand-700' }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link to="/register">
            <Button className="gap-2">
              <Sparkles className="size-4" strokeWidth={1.8} />
              Start Learning
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

function AuthedHeader() {
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
            <Link to="/courses" className="transition hover:text-brand-600">
              Курсы
            </Link>
            <Link to="/instructors" className="transition hover:text-brand-600">
              Преподаватели
            </Link>
            <Link to="/blog" className="transition hover:text-brand-600">
              Блог
            </Link>
            <Link to="/store" className="transition hover:text-brand-600">
              Магазин
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <AppSettings />
          <NotificationBell />
          <Link
            to="/cart"
            title="Корзина"
            className="rounded-lg p-2 text-ink/60 transition hover:bg-brand-50 hover:text-brand-600"
            aria-label="Корзина"
          >
            <ShoppingCart className="size-5" strokeWidth={1.8} />
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
        </div>
      </div>
    </header>
  )
}
