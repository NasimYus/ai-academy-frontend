import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'

// Active store products, optionally filtered by category.
export const productsQueryOptions = (categoryId?: number) =>
  queryOptions({
    queryKey: ['products', categoryId ?? null],
    queryFn: async () => {
      const { data } = await api.GET('/api/v1/products', {
        params: { query: { category_id: categoryId } },
      })
      return data ?? []
    },
  })

export const productQueryOptions = (productId: number) =>
  queryOptions({
    queryKey: ['product', productId],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/products/{product_id}', {
        params: { path: { product_id: productId } },
      })
      if (error) throw new Error('Не удалось загрузить товар')
      return data
    },
    enabled: productId > 0,
  })

export const productCategoriesQueryOptions = queryOptions({
  queryKey: ['product-categories'],
  queryFn: async () => {
    const { data } = await api.GET('/api/v1/product_categories', {})
    return data?.categories ?? []
  },
})
