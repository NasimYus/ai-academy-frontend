import { z } from 'zod'

export const forgotPasswordSchema = z.object({
  email: z.string().email('Введите корректный e-mail'),
})

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Минимум 6 символов'),
    password_confirmation: z.string(),
  })
  .refine((v) => v.password === v.password_confirmation, {
    message: 'Пароли не совпадают',
    path: ['password_confirmation'],
  })
