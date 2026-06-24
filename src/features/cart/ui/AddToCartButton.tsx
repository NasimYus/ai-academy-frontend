import { Link } from '@tanstack/react-router'

import { useAddToCart } from '#/features/cart/model/use-cart'

export function AddToCartButton({ courseId }: { courseId: number }) {
  const add = useAddToCart()

  if (add.isSuccess) {
    return (
      <Link
        to="/cart"
        className="mt-6 block rounded-full bg-green-600 px-4 py-2 text-center font-semibold text-white transition hover:bg-green-700"
      >
        В корзине — перейти к оформлению
      </Link>
    )
  }

  return (
    <>
      <button
        type="button"
        onClick={() => add.mutate(courseId)}
        disabled={add.isPending}
        className="mt-6 w-full rounded-full bg-brand-500 px-4 py-2 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
      >
        {add.isPending ? 'Добавляем…' : 'В корзину'}
      </button>
      {add.isError && <p className="mt-2 text-sm text-red-600">{add.error.message}</p>}
    </>
  )
}
