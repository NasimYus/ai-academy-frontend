import { Link, useNavigate } from '@tanstack/react-router'

import { useSessionStore } from '#/entities/session'

export function Header() {
  const navigate = useNavigate()
  const token = useSessionStore((s) => s.token)
  const user = useSessionStore((s) => s.user)
  const logout = useSessionStore((s) => s.logout)

  return (
    <header className="border-b border-brand-100 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="AI Academy" className="h-8 w-auto" />
        </Link>

        {token && (
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden text-ink/60 sm:inline">{user?.email}</span>
            <button
              onClick={() => {
                logout()
                navigate({ to: '/login' })
              }}
              className="rounded-lg border border-brand-200 px-3 py-1.5 font-medium text-brand-700 transition hover:bg-brand-50"
            >
              Выйти
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
