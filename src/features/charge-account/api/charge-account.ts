import { api } from '#/shared/api'

export interface ChargeInput {
  amount: number
  bank?: string
  reference_number?: string
}

export async function chargeAccount(input: ChargeInput) {
  const { data, error } = await api.POST('/api/v1/panel/financial/offline-payments', {
    body: {
      amount: input.amount,
      bank: input.bank || null,
      reference_number: input.reference_number || null,
    },
  })
  if (error) throw new Error('Не удалось отправить заявку')
  return data
}
