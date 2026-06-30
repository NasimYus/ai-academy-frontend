import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { CourseFormPage } from '#/pages/instructor'
import { withPanel } from '#/widgets/panel-layout'

export const Route = createFileRoute('/instructor/course/$courseId/edit')({
  beforeLoad: () => requireAuth(),
  validateSearch: (search: Record<string, unknown>): { step: number } => {
    const step = Number(search.step)
    return { step: Number.isFinite(step) && step >= 1 && step <= 8 ? step : 1 }
  },
  component: withPanel(EditCourseRoute),
})

function EditCourseRoute() {
  const { courseId } = Route.useParams()
  const { step } = Route.useSearch()
  return <CourseFormPage courseId={Number(courseId)} step={step} />
}
