import { createFileRoute } from '@tanstack/react-router'

import { StorePage } from '#/pages/store'

export const Route = createFileRoute('/store/')({
  component: StorePage,
})
