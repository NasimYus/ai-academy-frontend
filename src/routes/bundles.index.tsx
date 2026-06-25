import { createFileRoute } from '@tanstack/react-router'

import { BundlesPage } from '#/pages/bundles'

export const Route = createFileRoute('/bundles/')({
  component: BundlesPage,
})
