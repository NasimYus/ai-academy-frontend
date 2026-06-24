import { api } from '#/shared/api'

// Post a comment or reply on a blog post (legacy CommentsController@store, item=blog).
export async function postBlogComment(blogId: number, comment: string, replyId?: number) {
  const { error } = await api.POST('/api/v1/blogs/{blog_id}/comments', {
    params: { path: { blog_id: blogId } },
    body: { comment, reply_id: replyId ?? null },
  })
  if (error) throw new Error('Не удалось отправить комментарий')
}
