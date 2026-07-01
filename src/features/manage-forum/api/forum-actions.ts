import { api } from '#/shared/api'
import type { components } from '#/shared/api'

export type ForumTopicCreate = components['schemas']['ForumTopicCreate']

export async function createTopic(body: ForumTopicCreate) {
  const { data, error } = await api.POST('/api/v1/forum-topics', { body })
  if (error) throw new Error('Не удалось создать тему')
  return data
}

export async function replyToTopic(topicId: number, description: string) {
  const { data, error } = await api.POST('/api/v1/forum-topics/{topic_id}/posts', {
    params: { path: { topic_id: topicId } },
    body: { description },
  })
  if (error) throw new Error('Не удалось отправить ответ')
  return data
}
