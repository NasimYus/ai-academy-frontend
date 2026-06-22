import { z } from 'zod'

// Step 1: credentials. Legacy enforces password min 6 + confirmation match.
export const registerStep1Schema = z
  .object({
    email: z.string().email('Введите корректный e-mail'),
    password: z.string().min(6, 'Минимум 6 символов'),
    password_confirmation: z.string(),
  })
  .refine((v) => v.password === v.password_confirmation, {
    message: 'Пароли не совпадают',
    path: ['password_confirmation'],
  })

// Step 2: the verification code (legacy codes are 5 digits).
export const registerStep2Schema = z.object({
  code: z.string().min(4, 'Введите код из письма'),
})

// Step 3: profile completion.
export const registerStep3Schema = z.object({
  full_name: z.string().min(3, 'Минимум 3 символа'),
})

export type RegisterStep1Input = z.infer<typeof registerStep1Schema>
