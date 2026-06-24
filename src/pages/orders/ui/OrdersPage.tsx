import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { ordersQueryOptions } from '#/entities/order'

const STATUS_LABEL: Record<string, string> = {
  pending: 'Ожидает оплаты',
  paying: 'Оплата',
  paid: 'Оплачен',
  fail: 'Ошибка',
}

const STATUS_CLASS: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  paying: 'bg-blue-100 text-blue-700',
  paid: 'bg-emerald-100 text-emerald-700',
  fail: 'bg-red-100 text-red-700',
}

export function OrdersPage() {
  const orders = useQuery(ordersQueryOptions)

  if (orders.isPending) return <p className="mx-auto max-w-3xl px-6 py-8 text-ink/60">Загрузка…</p>
  if (orders.isError)
    return <p className="mx-auto max-w-3xl px-6 py-8 text-red-600">{orders.error.message}</p>

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-ink">Мои заказы</h1>

      {orders.data.length === 0 ? (
        <p className="text-ink/60">
          Заказов пока нет.{' '}
          <Link to="/courses" className="text-brand-600 hover:underline">
            К курсам
          </Link>
        </p>
      ) : (
        <div className="space-y-3">
          {orders.data.map((order) => (
            <div key={order.id} className="rounded-lg border border-brand-100 bg-white p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium text-ink">Заказ #{order.id}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASS[order.status] ?? ''}`}
                >
                  {STATUS_LABEL[order.status] ?? order.status}
                </span>
              </div>
              <ul className="mt-2 space-y-1 text-sm text-ink/70">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>{item.title ?? `#${item.course_id}`}</span>
                    <span>{item.total_amount} TJS</span>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex justify-between border-t border-brand-50 pt-2 text-sm">
                {order.total_discount ? (
                  <span className="text-emerald-600">скидка −{order.total_discount} TJS</span>
                ) : (
                  <span />
                )}
                <span className="font-bold text-ink">Итого: {order.total_amount} TJS</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
