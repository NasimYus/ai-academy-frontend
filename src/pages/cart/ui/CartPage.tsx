import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'

import { cartQueryOptions } from '#/entities/cart'
import { CouponForm, useRemoveFromCart } from '#/features/cart'
import type { CouponValidation } from '#/features/cart'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export function CartPage() {
  const cart = useQuery(cartQueryOptions)
  const remove = useRemoveFromCart()
  const [coupon, setCoupon] = useState<CouponValidation | null>(null)

  if (cart.isPending) return <p className="mx-auto max-w-3xl px-6 py-8 text-ink/60">Загрузка…</p>
  if (cart.isError)
    return <p className="mx-auto max-w-3xl px-6 py-8 text-red-600">{cart.error.message}</p>

  const { items } = cart.data
  // Use coupon-adjusted amounts when a valid coupon is applied.
  const amounts = coupon?.valid && coupon.amounts ? coupon.amounts : cart.data.amounts

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold text-ink">Корзина</h1>

      {items.length === 0 ? (
        <p className="text-ink/60">
          Корзина пуста.{' '}
          <Link to="/courses" className="text-brand-600 hover:underline">
            К курсам
          </Link>
        </p>
      ) : (
        <>
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-lg border border-brand-100 bg-white p-3"
              >
                {item.thumbnail && (
                  <img
                    src={`${API_URL}${item.thumbnail}`}
                    alt=""
                    className="size-14 rounded object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <Link
                    to="/course/$slug"
                    params={{ slug: item.slug }}
                    className="block truncate font-medium text-ink hover:underline"
                  >
                    {item.title}
                  </Link>
                  {item.teacher_name && (
                    <p className="text-xs text-ink/50">{item.teacher_name}</p>
                  )}
                </div>
                <span className="font-semibold text-ink">{item.price} TJS</span>
                <button
                  type="button"
                  onClick={() => remove.mutate(item.id)}
                  disabled={remove.isPending}
                  className="text-sm text-red-600 hover:underline disabled:opacity-50"
                >
                  Удалить
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-lg border border-brand-100 bg-white p-4">
            <div className="flex justify-between text-sm text-ink/70">
              <span>Подытог</span>
              <span>{amounts.sub_total} TJS</span>
            </div>
            {amounts.total_discount > 0 && (
              <div className="mt-1 flex justify-between text-sm text-emerald-600">
                <span>Скидка{coupon?.discount ? ` (${coupon.discount.code})` : ''}</span>
                <span>−{amounts.total_discount} TJS</span>
              </div>
            )}
            <div className="mt-2 flex justify-between text-lg font-bold text-ink">
              <span>Итого</span>
              <span>{amounts.total} TJS</span>
            </div>

            <CouponForm onApplied={setCoupon} />

            <button
              type="button"
              disabled
              title="Оформление и оплата — следующие срезы (4.3/4.4)"
              className="mt-4 w-full cursor-not-allowed rounded-full bg-brand-500 px-4 py-2 font-semibold text-white opacity-60"
            >
              Оформить заказ
            </button>
          </div>
        </>
      )}
    </div>
  )
}
