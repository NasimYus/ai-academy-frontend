import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { CourseFormPage } from '#/pages/instructor'

export const Route = createFileRoute('/instructor/course/$courseId/edit')({
  beforeLoad: () => requireAuth(),
  component: EditCourseRoute,
})

function EditCourseRoute() {
  const { courseId } = Route.useParams()
  return <CourseFormPage courseId={Number(courseId)} />
}
