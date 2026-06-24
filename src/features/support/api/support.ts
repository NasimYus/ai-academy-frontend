import { api } from '#/shared/api'

export interface CreateTicketInput {
  title: string
  type: 'course_support' | 'platform_support'
  message: string
  departmentId?: number | null
  courseId?: number | null
  attach?: File | null
}

// Open a new support ticket (multipart; legacy SupportsController@store).
export async function createTicket(input: CreateTicketInput) {
  const { data, error } = await api.POST('/api/v1/support', {
    body: {
      title: input.title,
      type: input.type,
      message: input.message,
      department_id: input.departmentId ?? null,
      course_id: input.courseId ?? null,
    },
    bodySerializer: (body) => {
      const fd = new FormData()
      fd.append('title', body.title)
      fd.append('type', body.type)
      fd.append('message', body.message)
      if (body.department_id != null)
        fd.append('department_id', String(body.department_id))
      if (body.course_id != null) fd.append('course_id', String(body.course_id))
      if (input.attach) fd.append('attach', input.attach)
      return fd
    },
  })
  if (error) throw new Error('Не удалось создать обращение')
  return data
}

// Reply to a ticket (multipart; legacy SupportsController@storeConversations).
export async function replyToTicket(
  supportId: number,
  message: string,
  attachment?: File | null,
) {
  const { data, error } = await api.POST(
    '/api/v1/support/{support_id}/conversations',
    {
      params: { path: { support_id: supportId } },
      body: { message },
      bodySerializer: (body) => {
        const fd = new FormData()
        fd.append('message', body.message)
        if (attachment) fd.append('attachment', attachment)
        return fd
      },
    },
  )
  if (error) throw new Error('Не удалось отправить сообщение')
  return data
}

// Close a ticket (legacy SupportsController@close — GET in legacy).
export async function closeTicket(supportId: number) {
  const { error } = await api.GET('/api/v1/support/{support_id}/close', {
    params: { path: { support_id: supportId } },
  })
  if (error) throw new Error('Не удалось закрыть обращение')
}
