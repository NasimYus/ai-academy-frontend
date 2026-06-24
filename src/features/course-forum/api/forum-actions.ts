import type { ForumAnswer, ForumThread } from '#/entities/forum'
import { api } from '#/shared/api'

export interface NewThreadInput {
  title: string
  description: string
  attachment?: File | null
}

// Open a question (multipart; legacy CourseForumController@store).
export async function createThread(courseId: number, input: NewThreadInput): Promise<ForumThread> {
  const { data, error } = await api.POST('/api/v1/courses/{course_id}/forums', {
    params: { path: { course_id: courseId } },
    body: { title: input.title, description: input.description },
    bodySerializer: (body) => {
      const fd = new FormData()
      fd.append('title', body.title)
      fd.append('description', body.description)
      if (input.attachment) fd.append('attachment', input.attachment)
      return fd
    },
  })
  if (error) throw new Error('Не удалось создать вопрос')
  return data
}

export async function toggleThreadPin(forumId: number): Promise<ForumThread> {
  const { data, error } = await api.POST('/api/v1/forums/{forum_id}/pin', {
    params: { path: { forum_id: forumId } },
  })
  if (error) throw new Error('Не удалось закрепить')
  return data
}

export async function createAnswer(forumId: number, description: string): Promise<ForumAnswer> {
  const { data, error } = await api.POST('/api/v1/forums/{forum_id}/answers', {
    params: { path: { forum_id: forumId } },
    body: { description },
  })
  if (error) throw new Error('Не удалось отправить ответ')
  return data
}

export async function toggleAnswerPin(answerId: number): Promise<ForumAnswer> {
  const { data, error } = await api.POST('/api/v1/answers/{answer_id}/pin', {
    params: { path: { answer_id: answerId } },
  })
  if (error) throw new Error('Не удалось закрепить ответ')
  return data
}

export async function toggleResolve(answerId: number): Promise<ForumAnswer> {
  const { data, error } = await api.POST('/api/v1/answers/{answer_id}/resolve', {
    params: { path: { answer_id: answerId } },
  })
  if (error) throw new Error('Не удалось изменить статус')
  return data
}
