import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { InstructorStatisticsPage } from '#/pages/instructor-statistics'

export const Route = createFileRoute('/instructor/course/$courseId/statistics')({
  beforeLoad: () => requireAuth(),
  component: StatisticsRoute,
})

function StatisticsRoute() {
  const { courseId } = Route.useParams()
  return <InstructorStatisticsPage courseId={Number(courseId)} />
}
