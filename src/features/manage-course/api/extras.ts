import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'
import type { components } from '#/shared/api'

export type FaqRead = components['schemas']['FaqRead']
export type ExtraRead = components['schemas']['ExtraRead']
export type ExtraType = 'learning' | 'requirement'
export type LogoRead = components['schemas']['LogoRead']

export const faqsQueryOptions = (courseId: number) =>
  queryOptions({
    queryKey: ['course-faqs', courseId],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/panel/webinar/{course_id}/faqs', {
        params: { path: { course_id: courseId } },
      })
      if (error) throw new Error('Не удалось загрузить FAQ')
      return data
    },
    enabled: courseId > 0,
  })

export const extrasQueryOptions = (courseId: number) =>
  queryOptions({
    queryKey: ['course-extras-list', courseId],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/panel/webinar/{course_id}/extras', {
        params: { path: { course_id: courseId } },
      })
      if (error) throw new Error('Не удалось загрузить материалы')
      return data
    },
    enabled: courseId > 0,
  })

export const logosQueryOptions = (courseId: number) =>
  queryOptions({
    queryKey: ['course-logos', courseId],
    queryFn: async () => {
      const { data, error } = await api.GET('/api/v1/panel/webinar/{course_id}/logos', {
        params: { path: { course_id: courseId } },
      })
      if (error) throw new Error('Не удалось загрузить логотипы')
      return data
    },
    enabled: courseId > 0,
  })

export async function addFaq(courseId: number, question: string, answer: string, locale: string) {
  const { data, error } = await api.POST('/api/v1/panel/webinar/{course_id}/faqs', {
    params: { path: { course_id: courseId } },
    body: { question, answer: answer || null, locale },
  })
  if (error) throw new Error('Не удалось добавить вопрос')
  return data
}

export async function deleteFaq(faqId: number) {
  const { error } = await api.DELETE('/api/v1/panel/faqs/{faq_id}', {
    params: { path: { faq_id: faqId } },
  })
  if (error) throw new Error('Не удалось удалить вопрос')
}

export async function addExtra(courseId: number, type: ExtraType, title: string, locale: string) {
  const { data, error } = await api.POST('/api/v1/panel/webinar/{course_id}/extras', {
    params: { path: { course_id: courseId } },
    body: { type, title, locale },
  })
  if (error) throw new Error('Не удалось добавить элемент')
  return data
}

export async function deleteExtra(extraId: number) {
  const { error } = await api.DELETE('/api/v1/panel/extras/{extra_id}', {
    params: { path: { extra_id: extraId } },
  })
  if (error) throw new Error('Не удалось удалить элемент')
}

export async function addLogo(courseId: number, image: string) {
  const { data, error } = await api.POST('/api/v1/panel/webinar/{course_id}/logos', {
    params: { path: { course_id: courseId } },
    body: { image },
  })
  if (error) throw new Error('Не удалось добавить логотип')
  return data
}

export async function deleteLogo(logoId: number) {
  const { error } = await api.DELETE('/api/v1/panel/logos/{logo_id}', {
    params: { path: { logo_id: logoId } },
  })
  if (error) throw new Error('Не удалось удалить логотип')
}
