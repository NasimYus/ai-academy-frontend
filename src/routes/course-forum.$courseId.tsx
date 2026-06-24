import { createFileRoute } from '@tanstack/react-router'

import { requireAuth } from '#/entities/session'
import { CourseForumPage } from '#/pages/course-forum'

export const Route = createFileRoute('/course-forum/$courseId')({
  beforeLoad: () => requireAuth(),
  component: CourseForumRoute,
})

function CourseForumRoute() {
  const { courseId } = Route.useParams()
  return <CourseForumPage courseId={Number(courseId)} />
}
