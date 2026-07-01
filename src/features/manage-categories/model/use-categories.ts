import { useMutation, useQueryClient } from '@tanstack/react-query'

import type {
  CategoryCreateBody,
  CategoryUpdateBody,
} from '#/features/manage-categories/api/categories'
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from '#/features/manage-categories/api/categories'

export function useCategoryAdmin() {
  const qc = useQueryClient()
  const invalidate = () => {
    void qc.invalidateQueries({ queryKey: ['admin-categories'] })
    void qc.invalidateQueries({ queryKey: ['categories'] })
  }

  const create = useMutation({
    mutationFn: (body: CategoryCreateBody) => createCategory(body),
    onSuccess: invalidate,
  })
  const update = useMutation({
    mutationFn: ({ id, body }: { id: number; body: CategoryUpdateBody }) => updateCategory(id, body),
    onSuccess: invalidate,
  })
  const remove = useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: invalidate,
  })

  return { create, update, remove }
}
