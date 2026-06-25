import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { sellerSalesQueryOptions } from '#/entities/sale'

const TYPE_RU: Record<string, string> = {
  webinar: 'Курс',
  meeting: 'Консультация',
  subscribe: 'Подписка',
  bundle: 'Набор',
  product: 'Товар',
  promotion: 'Продвижение',
  registration_package: 'Пакет',
  gift: 'Подарок',
  installment_payment: 'Рассрочка',
}

export function InstructorSalesPage() {
  const { data, isPending, isError, error } = useQuery(sellerSalesQueryOptions)

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink">Продажи</h1>
        <Link to="/instructor" className="text-sm text-brand-600 hover:underline">
          ← К курсам
        </Link>
      </div>

      {isPending ? (
        <p className="text-ink/60">Загрузка…</p>
      ) : isError ? (
        <p className="text-red-600">{error.message}</p>
      ) : (
        <>
          <div className="rounded-xl border border-brand-100 bg-brand-50 px-4 py-3">
            <p className="text-sm text-ink/60">Всего дохода</p>
            <p className="text-2xl font-bold text-ink">
              {data.total_income.toLocaleString('ru-RU')}{' '}
              <span className="text-base font-normal text-ink/50">({data.count} продаж)</span>
            </p>
          </div>

          {data.sales.length === 0 ? (
            <p className="text-ink/60">Продаж пока нет.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-100 text-left text-ink/50">
                  <th className="py-2">#</th>
                  <th>Тип</th>
                  <th>Способ</th>
                  <th className="text-right">Сумма</th>
                </tr>
              </thead>
              <tbody>
                {data.sales.map((s) => (
                  <tr key={s.id} className="border-b border-brand-50">
                    <td className="py-2 text-ink/40">{s.id}</td>
                    <td className="text-ink">{TYPE_RU[s.type] ?? s.type}</td>
                    <td className="text-ink/60">
                      {s.payment_method === 'credit' ? 'Кошелёк' : 'Шлюз'}
                    </td>
                    <td className="text-right font-medium text-ink">
                      {s.total_amount.toLocaleString('ru-RU')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  )
}
