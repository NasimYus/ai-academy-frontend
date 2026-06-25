import { createFileRoute } from '@tanstack/react-router'

import { BundlePage } from '#/pages/bundle'

export const Route = createFileRoute('/bundles/$bundleId')({
  component: BundleRoute,
})

function BundleRoute() {
  const { bundleId } = Route.useParams()
  return <BundlePage bundleId={Number(bundleId)} />
}
