import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  addPrerequisite,
  addRelated,
  deletePrerequisite,
  deleteRelated,
} from '#/features/manage-course/api/relations'

export function useRelationMutations(courseId: number) {
  const qc = useQueryClient()
  const invPre = () => qc.invalidateQueries({ queryKey: ['course-prerequisites', courseId] })
  const invRel = () => qc.invalidateQueries({ queryKey: ['course-related', courseId] })

  const addPre = useMutation({
    mutationFn: ({ id, required }: { id: number; required: boolean }) =>
      addPrerequisite(courseId, id, required),
    onSuccess: invPre,
  })
  const removePre = useMutation({
    mutationFn: (rowId: number) => deletePrerequisite(rowId),
    onSuccess: invPre,
  })
  const addRel = useMutation({
    mutationFn: (id: number) => addRelated(courseId, id),
    onSuccess: invRel,
  })
  const removeRel = useMutation({
    mutationFn: (rowId: number) => deleteRelated(rowId),
    onSuccess: invRel,
  })

  return { addPre, removePre, addRel, removeRel }
}
