import { useQuery } from '@tanstack/react-query'
import { Check, CreditCard, Wallet } from 'lucide-react'
import { useState } from 'react'

import { balanceQueryOptions, offlinePaymentsQueryOptions } from '#/entities/financial'
import { useChargeAccount } from '#/features/charge-account'
import { Badge, Button, Field, PageHeader, Spinner } from '#/shared/ui'
import { PanelLayout } from '#/widgets/panel-layout'

const STATUS: Record<string, { label: string; tone: 'success' | 'warning' | 'danger' }> = {
  approved: { label: 'Одобрено', tone: 'success' },
  waiting: { label: 'В ожидании', tone: 'warning' },
  reject: { label: 'Отклонено', tone: 'danger' },
}

const fmt = (iso: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))

export function ChargeAccountPage() {
  const balance = useQuery(balanceQueryOptions)
  const history = useQuery(offlinePaymentsQueryOptions)
  const charge = useChargeAccount()
  const [amount, setAmount] = useState('')
  const [bank, setBank] = useState('')
  const [reference, setReference] = useState('')
  // Payment method selector (legacy radios). Only offline is supported — online
  // gateways for account top-up aren't ported yet — but the option is a real,
  // clickable, selected control rather than a dead label.
  const [method, setMethod] = useState<string>('offline')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const value = Number(amount)
    if (!value || value <= 0) return
    charge.mutate(
      { amount: value, bank: bank || undefined, reference_number: reference || undefined },
      {
        onSuccess: () => {
          setAmount('')
          setBank('')
          setReference('')
        },
      },
    )
  }

  return (
    <PanelLayout>
      <PageHeader title="Пополнение счёта" />

      {/* Balance card */}
      <div className="rounded-3xl bg-white p-4">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 to-brand-500 p-6 text-white">
          <span className="flex size-11 items-center justify-center rounded-xl bg-white/15">
            <Wallet className="size-6" />
          </span>
          <p className="mt-4 font-display text-sm font-bold">Текущий баланс</p>
          <p className="mt-1 text-xs text-white/70">{fmt(new Date().toISOString())}</p>
          <p className="mt-4 font-display text-4xl font-bold">
            {balance.isPending ? '…' : `${(balance.data?.charge ?? 0).toLocaleString('ru-RU')}C`}
          </p>
        </div>
      </div>

      {/* Charge form */}
      <div className="mt-6 rounded-3xl bg-white p-5">
        <h3 className="font-display font-bold text-ink">Пополнить счёт</h3>
        <p className="mt-1 text-sm text-ink/50">Пополните счёт для будущих покупок.</p>

        <p className="mt-5 text-sm font-bold text-ink">Выберите способ оплаты</p>
        <div className="mt-2 flex flex-wrap gap-3">
          <button
            type="button"
            role="radio"
            aria-checked={method === 'offline'}
            onClick={() => setMethod('offline')}
            className={`inline-flex items-center gap-2 rounded-2xl border px-5 py-4 text-sm font-medium transition ${
              method === 'offline'
                ? 'border-brand-500 bg-brand-50 text-brand-700 ring-1 ring-brand-500'
                : 'border-brand-200 text-ink/70 hover:bg-brand-50/60'
            }`}
          >
            <CreditCard className="size-5 text-brand-600" />
            Офлайн-платёж
            {method === 'offline' && <Check className="size-4 text-brand-600" />}
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Банк" value={bank} onChange={(e) => setBank(e.target.value)} />
          <Field
            label="Реферальный код"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
          <Field
            label="Сумма пополнения"
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <div className="flex items-end">
            <Button type="submit" disabled={charge.isPending} className="w-full py-3">
              {charge.isPending ? 'Отправка…' : 'Отправить'}
            </Button>
          </div>
        </form>
        {charge.isError && <p className="mt-2 text-sm text-red-600">{charge.error.message}</p>}
        {charge.isSuccess && (
          <p className="mt-2 text-sm text-green-600">Заявка отправлена — ожидает подтверждения.</p>
        )}
      </div>

      {/* Offline history */}
      <div className="mt-6 rounded-3xl bg-white p-5">
        <h3 className="font-display font-bold text-ink">История офлайн-транзакций</h3>
        {history.isPending ? (
          <Spinner />
        ) : (history.data?.length ?? 0) === 0 ? (
          <p className="mt-4 text-sm text-ink/50">Транзакций пока нет.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-brand-50 text-left text-xs font-bold uppercase tracking-wide text-ink/40">
                  <th className="pb-3">Банк</th>
                  <th className="pb-3">Реферальный код</th>
                  <th className="pb-3 text-right">Сумма (C)</th>
                  <th className="pb-3 text-right">Статус</th>
                </tr>
              </thead>
              <tbody>
                {history.data?.map((p) => {
                  const s = STATUS[p.status] ?? STATUS.waiting
                  return (
                    <tr key={p.id} className="border-b border-brand-50/60">
                      <td className="py-3">
                        <span className="text-ink/80">{p.bank ?? '—'}</span>
                        <span className="mt-0.5 block text-xs text-ink/40">
                          {fmt(p.created_at)}
                        </span>
                      </td>
                      <td className="py-3 text-ink/70">{p.reference_number ?? '—'}</td>
                      <td className="py-3 text-right font-bold text-ink">
                        {p.amount.toLocaleString('ru-RU')}
                      </td>
                      <td className="py-3 text-right">
                        <Badge tone={s.tone}>{s.label}</Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PanelLayout>
  )
}
