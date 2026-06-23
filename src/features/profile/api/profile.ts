import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'
import type { components } from '#/shared/api'

export type Profile = components['schemas']['ProfileRead']

export const profileQueryOptions = queryOptions({
  queryKey: ['profile'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/panel/profile-setting', {})
    if (error) throw new Error('Не удалось загрузить профиль')
    return data
  },
})

export async function updateProfile(input: {
  full_name?: string
  bio?: string | null
  about?: string | null
  language?: string | null
  timezone?: string | null
  newsletter?: boolean
  public_message?: boolean
}): Promise<Profile> {
  const { data, error } = await api.PUT('/api/v1/panel/profile-setting', { body: input })
  if (error) throw new Error('Не удалось сохранить профиль')
  return data
}

export async function changePassword(input: {
  current_password: string
  new_password: string
}): Promise<string> {
  const { data, error } = await api.PUT('/api/v1/panel/profile-setting/password', { body: input })
  if (error) throw new Error('Не удалось изменить пароль. Проверьте текущий пароль')
  return data.token
}

export async function uploadAvatar(file: File): Promise<string | null> {
  const { data, error } = await api.POST('/api/v1/panel/profile-setting/images', {
    body: {},
    bodySerializer: () => {
      const fd = new FormData()
      fd.append('profile_image', file)
      return fd
    },
  })
  if (error) throw new Error('Не удалось загрузить изображение')
  return data.avatar ?? null
}
