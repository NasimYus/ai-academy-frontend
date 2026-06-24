import { useNavigate } from '@tanstack/react-router'

import { useCheckout } from '#/features/checkout/model/use-checkout'

export function CheckoutButton({ discountId }: { discountId?: number | null }) {
  const navigate = useNavigate()
  const checkout = useCheckout()

  const submit = () =>
    checkout.mutate(discountId, {
      onSuccess: () => void navigate({ to: '/orders' }),
    })

  return (
    <>
      <button
        type="button"
        onClick={submit}
        disabled={checkout.isPending}
        className="mt-4 w-full rounded-full bg-brand-500 px-4 py-2 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
      >
        {checkout.isPending ? 'Оформляем…' : 'Оформить заказ'}
      </button>
      {checkout.isError && <p className="mt-2 text-sm text-red-600">{checkout.error.message}</p>}
    </>
  )
}
