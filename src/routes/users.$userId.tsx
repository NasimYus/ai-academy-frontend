import { createFileRoute } from '@tanstack/react-router'

import { UserProfilePage } from '#/pages/user'

export const Route = createFileRoute('/users/$userId')({ component: UserProfileRoute })

function UserProfileRoute() {
  const { userId } = Route.useParams()
  return <UserProfilePage userId={Number(userId)} />
}
