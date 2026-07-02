import { z } from 'zod'

// Strong-password policy — mirrors the backend validator
// (length + letter + digit + special char). Keep the two in sync.
export const passwordSchema = z
  .string()
  .min(8, 'Минимум 8 символов')
  .max(128, 'Максимум 128 символов')
  .regex(/[^\W\d_]/u, 'Нужна хотя бы одна буква')
  .regex(/\d/, 'Нужна хотя бы одна цифра')
  .regex(/[^\w\s]|_/, 'Нужен хотя бы один спецсимвол (!@#$…)')
