import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'

export const BLOG_QUERY_KEY = ['blog'] as const

// Published posts, optionally filtered by category (legacy BlogController@index).
export const blogListQueryOptions = (categoryId?: number) =>
  queryOptions({
    queryKey: [...BLOG_QUERY_KEY, 'list', categoryId ?? null],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/blogs', {
        params: { query: categoryId ? { cat: categoryId } : {} },
      })
      if (error) throw new Error('Не удалось загрузить блог')
      return data
    },
  })

// A single published post with its comment thread.
export const blogQueryOptions = (blogId: number) =>
  queryOptions({
    queryKey: [...BLOG_QUERY_KEY, 'detail', blogId],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/blogs/{blog_id}', {
        params: { path: { blog_id: blogId } },
      })
      if (error) throw new Error('Не удалось загрузить статью')
      return data.blog
    },
  })

// Blog categories (legacy BlogCategoryController@index).
export const blogCategoriesQueryOptions = queryOptions({
  queryKey: [...BLOG_QUERY_KEY, 'categories'],
  queryFn: async () => {
    const { data } = await api.GET('/api/v1/blogs/categories', {})
    return data ?? []
  },
})
