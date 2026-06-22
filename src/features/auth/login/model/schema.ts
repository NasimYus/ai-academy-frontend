import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Введите корректный e-mail'),
  password: z.string().min(8, 'Минимум 8 символов'),
})

export type LoginInput = z.infer<typeof loginSchema>
