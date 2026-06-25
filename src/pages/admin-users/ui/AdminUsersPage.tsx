import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'

import {
  adminUsersQueryOptions,
  useBanUser,
  useSetUserRole,
  useUnbanUser,
} from '#/features/manage-users'

const ROLES = [
  { id: 1, name: 'user', label: 'Студент' },
  { id: 4, name: 'teacher', label: 'Преподаватель' },
  { id: 3, name: 'organization', label: 'Организация' },
  { id: 2, name: 'admin', label: 'Админ' },
]

const ROLE_RU = Object.fromEntries(ROLES.map((r) => [r.name, r.label]))

export function AdminUsersPage() {
  const [roleFilter, setRoleFilter] = useState<string>('')
  const { data, isPending, isError, error } = useQuery(adminUsersQueryOptions(roleFilter || undefined))
  const ban = useBanUser()
  const unban = useUnbanUser()
  const setRole = useSetUserRole()
  const busy = ban.isPending || unban.isPending || setRole.isPending

  return (
    <div className="mx-auto max-w-4xl space-y-5 px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Пользователи</h1>
        <Link to="/admin/courses" className="text-sm text-brand-600 hover:underline">
          Модерация курсов →
        </Link>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className="text-ink/60">Роль:</span>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-brand-200 px-3 py-1.5"
        >
          <option value="">Все</option>
          {ROLES.map((r) => (
            <option key={r.id} value={r.name}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {isPending ? (
        <p className="text-ink/60">Загрузка…</p>
      ) : isError ? (
        <p className="text-red-600">{error.message}</p>
      ) : (
        <ul className="space-y-2">
          {data.users.map((u) => (
            <li
              key={u.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand-100 bg-white px-4 py-3"
            >
              <div>
                <span className="font-medium text-ink">{u.full_name ?? u.email ?? `#${u.id}`}</span>
                <span className="ml-2 text-xs text-ink/50">{u.email}</span>
                {u.ban && (
                  <span className="ml-2 rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-700">
                    Забанен
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <select
                  value={ROLES.find((r) => r.name === u.role_name)?.id ?? ''}
                  onChange={(e) => setRole.mutate({ userId: u.id, roleId: Number(e.target.value) })}
                  disabled={busy}
                  className="rounded-lg border border-brand-200 px-2 py-1 text-xs"
                  title={ROLE_RU[u.role_name] ?? u.role_name}
                >
                  {ROLES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
                {u.ban ? (
                  <button
                    type="button"
                    onClick={() => unban.mutate(u.id)}
                    disabled={busy}
                    className="text-green-700 hover:underline disabled:opacity-50"
                  >
                    Разбанить
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => ban.mutate({ userId: u.id, days: null })}
                    disabled={busy}
                    className="text-red-600 hover:underline disabled:opacity-50"
                  >
                    Забанить
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      {(ban.isError || unban.isError || setRole.isError) && (
        <p className="text-sm text-red-600">
          {ban.error?.message ?? unban.error?.message ?? setRole.error?.message}
        </p>
      )}
    </div>
  )
}
