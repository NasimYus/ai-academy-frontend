import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'
import type { components } from '#/shared/api'

export type AdminUser = components['schemas']['AdminUserRead']

export const ADMIN_USERS_KEY = ['admin', 'users'] as const

export const adminUsersQueryOptions = (role?: string) =>
  queryOptions({
    queryKey: [...ADMIN_USERS_KEY, role ?? 'all'],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/admin/users', {
        params: { query: role ? { role } : {} },
      })
      if (error) throw new Error('Не удалось загрузить пользователей')
      return data
    },
  })

export async function banUser(userId: number, days: number | null) {
  const { data, error } = await api.POST('/api/v1/admin/users/{user_id}/ban', {
    params: { path: { user_id: userId } },
    body: { days },
  })
  if (error) throw new Error('Не удалось забанить')
  return data
}

export async function unbanUser(userId: number) {
  const { data, error } = await api.POST('/api/v1/admin/users/{user_id}/unban', {
    params: { path: { user_id: userId } },
  })
  if (error) throw new Error('Не удалось разбанить')
  return data
}

export async function setUserRole(userId: number, roleId: number) {
  const { data, error } = await api.POST('/api/v1/admin/users/{user_id}/role', {
    params: { path: { user_id: userId } },
    body: { role_id: roleId },
  })
  if (error) throw new Error('Не удалось изменить роль')
  return data
}
