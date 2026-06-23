import { api } from '#/shared/api'

export interface SubmitInput {
  message: string
  fileTitle?: string
  attachment?: File | null
}

// Legacy submit-gate detail codes → human messages.
const SUBMIT_MESSAGE: Record<string, string> = {
  not_purchased: 'Запишитесь на курс, чтобы отправлять работы',
  assignment_deadline_or_attempts: 'Срок сдачи истёк или исчерпаны попытки',
}

export function submitMessage(detail: unknown): string {
  return (typeof detail === 'string' && SUBMIT_MESSAGE[detail]) || 'Не удалось отправить работу'
}

// Post a submission/message (multipart; legacy AssignmentHistoryMessageController@store).
export async function submitAssignmentMessage(assignmentId: number, input: SubmitInput) {
  const { data, error } = await api.POST('/api/v1/assignments/{assignment_id}/messages', {
    params: { path: { assignment_id: assignmentId } },
    body: {},
    bodySerializer: () => {
      const fd = new FormData()
      fd.append('message', input.message)
      if (input.fileTitle) fd.append('file_title', input.fileTitle)
      if (input.attachment) fd.append('attachment', input.attachment)
      return fd
    },
  })
  if (error) throw new Error(submitMessage(error.detail))
  return data
}
