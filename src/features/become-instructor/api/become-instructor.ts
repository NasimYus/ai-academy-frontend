import { api } from '#/shared/api'

export interface BecomeInstructorInput {
  role: 'teacher' | 'organization'
  occupations: number[]
  description?: string
}

export async function submitBecomeInstructor(input: BecomeInstructorInput) {
  const { data, error } = await api.POST('/api/v1/panel/become-instructor', {
    body: {
      role: input.role,
      occupations: input.occupations,
      description: input.description || null,
    },
  })
  if (error) throw new Error('Не удалось отправить заявку')
  return data
}

export async function moderateBecomeInstructor(id: number, action: 'accept' | 'reject') {
  const params = { params: { path: { request_id: id } } }
  const { data, error } =
    action === 'accept'
      ? await api.POST('/api/v1/admin/become-instructors/{request_id}/accept', params)
      : await api.POST('/api/v1/admin/become-instructors/{request_id}/reject', params)
  if (error) throw new Error('Не удалось обработать заявку')
  return data
}
