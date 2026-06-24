import { createFileRoute } from '@tanstack/react-router'

import { BlogPostPage } from '#/pages/blog-post'

export const Route = createFileRoute('/blog/$blogId')({
  component: BlogPostRoute,
})

function BlogPostRoute() {
  const { blogId } = Route.useParams()
  return <BlogPostPage blogId={Number(blogId)} />
}
