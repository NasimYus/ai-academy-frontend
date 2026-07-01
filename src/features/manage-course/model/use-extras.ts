import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { ExtraType } from '#/features/manage-course/api/extras'
import {
  addExtra,
  addFaq,
  addLogo,
  deleteExtra,
  deleteFaq,
  deleteLogo,
} from '#/features/manage-course/api/extras'

export function useExtraMutations(courseId: number) {
  const qc = useQueryClient()
  const inv = (key: string) => () => qc.invalidateQueries({ queryKey: [key, courseId] })

  const addFaqM = useMutation({
    mutationFn: ({ question, answer, locale }: { question: string; answer: string; locale: string }) =>
      addFaq(courseId, question, answer, locale),
    onSuccess: inv('course-faqs'),
  })
  const removeFaq = useMutation({
    mutationFn: (id: number) => deleteFaq(id),
    onSuccess: inv('course-faqs'),
  })
  const addExtraM = useMutation({
    mutationFn: ({ type, title, locale }: { type: ExtraType; title: string; locale: string }) =>
      addExtra(courseId, type, title, locale),
    onSuccess: inv('course-extras-list'),
  })
  const removeExtra = useMutation({
    mutationFn: (id: number) => deleteExtra(id),
    onSuccess: inv('course-extras-list'),
  })
  const addLogoM = useMutation({
    mutationFn: (image: string) => addLogo(courseId, image),
    onSuccess: inv('course-logos'),
  })
  const removeLogo = useMutation({
    mutationFn: (id: number) => deleteLogo(id),
    onSuccess: inv('course-logos'),
  })

  return { addFaqM, removeFaq, addExtraM, removeExtra, addLogoM, removeLogo }
}
