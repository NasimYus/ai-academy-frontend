import { createFileRoute } from '@tanstack/react-router'

import { ProductPage } from '#/pages/product'

export const Route = createFileRoute('/store/$productId')({
  component: ProductRoute,
})

function ProductRoute() {
  const { productId } = Route.useParams()
  return <ProductPage productId={Number(productId)} />
}
