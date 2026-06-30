import { queryOptions } from '@tanstack/react-query'

import { api } from '#/shared/api'
import type { components } from '#/shared/api'

export type AccountBalance = components['schemas']['AccountBalance']
export type Accounting = components['schemas']['AccountingRead']
export type OfflinePayment = components['schemas']['OfflinePaymentRead']

// Wallet balance (legacy getAccountingCharge).
export const balanceQueryOptions = queryOptions({
  queryKey: ['account-balance'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/panel/financial/account', {})
    if (error) throw new Error('Не удалось загрузить баланс')
    return data
  },
})

// Financial report — the student's ledger rows.
export const accountingQueryOptions = queryOptions({
  queryKey: ['accounting'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/panel/financial/accounting', {})
    if (error) throw new Error('Не удалось загрузить финансовый отчёт')
    return data
  },
})

// Offline top-up requests history.
export const offlinePaymentsQueryOptions = queryOptions({
  queryKey: ['offline-payments'],
  queryFn: async () => {
    const { data, error } = await api.GET('/api/v1/panel/financial/offline-payments', {})
    if (error) throw new Error('Не удалось загрузить транзакции')
    return data
  },
})
