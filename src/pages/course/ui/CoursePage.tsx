import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from '@tanstack/react-router'

import { courseQueryOptions } from '#/entities/course'
import { useEnrollFree } from '#/features/course-enroll'

export function CoursePage() {
  const { slug } = useParams({ from: '/course/$slug' })
  const course = useQuery(courseQueryOptions(slug))
  const enroll = useEnrollFree(slug)

  if (course.isPending) return <p className="mx-auto max-w-5xl px-6 py-8 text-ink/60">Загрузка…</p>
  if (course.isError)
    return <p className="mx-auto max-w-5xl px-6 py-8 text-red-600">{course.error.message}</p>

  const data = course.data

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink">{data.title}</h1>
          {data.category && <p className="mt-2 text-sm text-brand-600">{data.category}</p>}
          {data.reviews_count > 0 && (
            <p className="mt-2 text-sm text-ink/70">
              <span className="text-amber-500">★</span> {data.rate} · {data.reviews_count} отзывов
            </p>
          )}

          {data.image_cover && (
            <img
              src={data.image_cover}
              alt={data.title}
              className="mt-6 w-full rounded-card object-cover"
            />
          )}

          {data.description && (
            <section className="mt-8">
              <h2 className="font-display text-xl font-bold text-ink">Описание</h2>
              <p className="mt-2 whitespace-pre-line text-ink/80">{data.description}</p>
            </section>
          )}

          {data.teacher && (
            <section className="mt-8">
              <h2 className="font-display text-xl font-bold text-ink">Инструктор</h2>
              <Link
                to="/users/$userId"
                params={{ userId: String(data.teacher.id) }}
                className="mt-3 flex items-center gap-3"
              >
                {data.teacher.avatar && (
                  <img
                    src={data.teacher.avatar}
                    alt={data.teacher.full_name ?? ''}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold text-ink hover:text-brand-600">
                    {data.teacher.full_name}
                  </p>
                  {data.teacher.headline && (
                    <p className="text-sm text-ink/60">{data.teacher.headline}</p>
                  )}
                </div>
              </Link>
            </section>
          )}

          {data.reviews.length > 0 && (
            <section className="mt-8">
              <h2 className="font-display text-xl font-bold text-ink">Отзывы</h2>
              <div className="mt-3 space-y-3">
                {data.reviews.map((review) => (
                  <div key={review.id} className="border-t border-brand-50 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-ink">
                        {review.user?.full_name ?? 'Аноним'}
                      </span>
                      <span className="text-sm text-amber-500">★ {review.rates}</span>
                    </div>
                    {review.description && (
                      <p className="mt-1 text-sm text-ink/70">{review.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.comments.length > 0 && (
            <section className="mt-8">
              <h2 className="font-display text-xl font-bold text-ink">Комментарии</h2>
              <div className="mt-3 space-y-4">
                {data.comments.map((comment) => (
                  <div key={comment.id}>
                    <p className="font-medium text-ink">{comment.user?.full_name ?? 'Аноним'}</p>
                    <p className="text-sm text-ink/70">{comment.comment}</p>
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="ml-6 mt-2 border-l border-brand-100 pl-3">
                        <p className="font-medium text-ink">{reply.user?.full_name ?? 'Аноним'}</p>
                        <p className="text-sm text-ink/70">{reply.comment}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="h-fit rounded-card border border-brand-100 bg-white p-6 shadow-sm">
          <div className="text-2xl font-bold text-ink">
            {Number(data.price) === 0 ? 'Бесплатно' : `${data.price_string ?? data.price} TJS`}
          </div>

          <dl className="mt-4 space-y-2 text-sm text-ink/70">
            {data.duration != null && (
              <div className="flex justify-between">
                <dt>Длительность</dt>
                <dd>{data.duration} мин</dd>
              </div>
            )}
            {data.access_days != null && (
              <div className="flex justify-between">
                <dt>Доступ</dt>
                <dd>{data.access_days} дн.</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt>Студентов</dt>
              <dd>{data.students_count}</dd>
            </div>
            {data.certificate && (
              <div className="flex justify-between">
                <dt>Сертификат</dt>
                <dd>Да</dd>
              </div>
            )}
          </dl>

          {data.auth_has_bought ? (
            <Link
              to="/learn/$slug"
              params={{ slug }}
              className="mt-6 block rounded-full bg-green-600 px-4 py-2 text-center font-semibold text-white transition hover:bg-green-700"
            >
              Перейти к обучению
            </Link>
          ) : Number(data.price) === 0 ? (
            data.auth ? (
              <button
                type="button"
                onClick={() => enroll.mutate(data.id)}
                disabled={enroll.isPending}
                className="mt-6 w-full rounded-full bg-brand-500 px-4 py-2 font-semibold text-white transition hover:bg-brand-600 disabled:opacity-50"
              >
                {enroll.isPending ? 'Записываем…' : 'Записаться бесплатно'}
              </button>
            ) : (
              <Link
                to="/login"
                className="mt-6 block rounded-full bg-brand-500 px-4 py-2 text-center font-semibold text-white transition hover:bg-brand-600"
              >
                Войдите, чтобы записаться
              </Link>
            )
          ) : (
            <button
              type="button"
              disabled
              className="mt-6 w-full cursor-not-allowed rounded-full bg-brand-500 px-4 py-2 font-semibold text-white opacity-60"
              title="Оплата появится в Phase 4"
            >
              В корзину
            </button>
          )}
          {enroll.isError && (
            <p className="mt-2 text-sm text-red-600">{enroll.error.message}</p>
          )}
        </aside>
      </div>
    </div>
  )
}
