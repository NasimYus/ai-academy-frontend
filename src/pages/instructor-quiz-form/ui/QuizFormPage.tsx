import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { classesQueryOptions } from '#/features/manage-course'
import { QuizForm, quizResultsQueryOptions } from '#/features/manage-quiz'
import { PageHeader, Spinner } from '#/shared/ui'
import { PanelLayout } from '#/widgets/panel-layout'

export function QuizFormPage({ quizId }: { quizId?: number }) {
  const navigate = useNavigate()
  const classes = useQuery(classesQueryOptions)
  const dashboard = useQuery(quizResultsQueryOptions)
  const isEdit = quizId != null

  const courses = (classes.data ?? []).map((c) => ({ id: c.id, title: c.title }))
  const quiz = isEdit ? dashboard.data?.quizzes.find((q) => q.id === quizId) : undefined

  return (
    <PanelLayout>
      <PageHeader title={isEdit ? 'Редактирование теста' : 'Новый тест'} />
      {classes.isPending || (isEdit && dashboard.isPending) ? (
        <Spinner />
      ) : (
        <QuizForm
          courses={courses}
          quiz={quiz}
          onDone={() => void navigate({ to: '/instructor/quizzes' })}
        />
      )}
    </PanelLayout>
  )
}
