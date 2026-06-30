import { api } from '#/shared/api'

export interface ContactInput {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export async function submitContact(input: ContactInput) {
  const { data, error } = await api.POST('/api/v1/contact', {
    body: { ...input, phone: input.phone || null },
  })
  if (error) throw new Error('Не удалось отправить сообщение')
  return data
}
