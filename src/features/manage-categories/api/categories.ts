import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'
import type { components } from '#/shared/api'

export type AdminCategory = components['schemas']['AdminCategoryRead']
export type CategoryCreateBody = components['schemas']['CategoryCreate']
export type CategoryUpdateBody = components['schemas']['CategoryUpdate']

export const adminCategoriesQueryOptions = queryOptions({
  queryKey: ['admin-categories'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/admin/categories', {})
    if (error) throw new Error('Не удалось загрузить категории')
    return data
  },
})

export async function createCategory(body: CategoryCreateBody) {
  const { data, error } = await api.POST('/api/v1/admin/categories', { body })
  if (error) throw new Error('Не удалось создать категорию')
  return data
}

export async function updateCategory(id: number, body: CategoryUpdateBody) {
  const { data, error } = await api.PUT('/api/v1/admin/categories/{category_id}', {
    params: { path: { category_id: id } },
    body,
  })
  if (error) throw new Error('Не удалось обновить категорию')
  return data
}

export async function deleteCategory(id: number) {
  const { error } = await api.DELETE('/api/v1/admin/categories/{category_id}', {
    params: { path: { category_id: id } },
  })
  if (error) throw new Error('Не удалось удалить категорию')
}
