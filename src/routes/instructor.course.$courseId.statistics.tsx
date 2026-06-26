import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { InstructorStatisticsPage } from '#/pages/instructor-statistics'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/instructor/course/$courseId/statistics')({
  beforeLoad: () => requireAuth(),
  component: withPanel(StatisticsRoute),
})

function StatisticsRoute() {
  const { courseId } = Route.useParams()
  return <InstructorStatisticsPage courseId={Number(courseId)} />
}
