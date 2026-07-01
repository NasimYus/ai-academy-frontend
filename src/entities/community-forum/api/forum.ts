import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'
import type { components } from '#/shared/api'

export type ForumCategory = components['schemas']['ForumCategoryRead']
export type ForumTopicRow = components['schemas']['ForumTopicRow']
export type ForumTopicDetail = components['schemas']['ForumTopicDetail']
export type MyForumPost = components['schemas']['MyForumPostRow']

export const forumCategoriesQueryOptions = queryOptions({
  queryKey: ['forum-categories'],
  queryFn: async () => {
    // No declared error response -> use the data guard (error typed as never).
    const { data } = await api.GET('/api/v1/forums', {})
    return data ?? []
  },
})

export const forumTopicsQueryOptions = (forumId: number, search?: string) =>
  queryOptions({
    queryKey: ['forum-topics', forumId, search ?? ''],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/forums/{forum_id}/topics', {
        params: { path: { forum_id: forumId }, query: search ? { search } : {} },
      })
      if (error) throw new Error('Не удалось загрузить темы')
      return data
    },
    enabled: forumId > 0,
  })

export const forumTopicQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ['forum-topic', slug],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/forum-topics/{slug}', {
        params: { path: { slug } },
      })
      if (error) throw new Error('Тема не найдена')
      return data
    },
    enabled: !!slug,
  })

export const myTopicsQueryOptions = queryOptions({
  queryKey: ['forum-my-topics'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/panel/forums/topics', {})
    if (error) throw new Error('Не удалось загрузить темы')
    return data
  },
})

export const myPostsQueryOptions = queryOptions({
  queryKey: ['forum-my-posts'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/panel/forums/posts', {})
    if (error) throw new Error('Не удалось загрузить посты')
    return data
  },
})
