import { queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { NoteTargetType } from '#/entities/note'
import { deleteNote, getNote, saveNote } from '#/features/personal-note/api/notes'
import type { SaveNoteInput } from '#/features/personal-note/api/notes'

const noteKey = (targetType: NoteTargetType, targetId: number) =>
  ['personal-note', targetType, targetId] as const

export const noteQueryOptions = (targetType: NoteTargetType, targetId: number) =>
  queryOptions({
    queryKey: noteKey(targetType, targetId),
    queryFn: () => getNote(targetType, targetId),
  })

export function useNote(targetType: NoteTargetType, targetId: number) {
  return useQuery(noteQueryOptions(targetType, targetId))
}

export function useSaveNote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: SaveNoteInput) => saveNote(input),
    onSuccess: (_data, input) =>
      qc.invalidateQueries({ queryKey: noteKey(input.targetType, input.targetId) }),
  })
}

export function useDeleteNote(targetType: NoteTargetType, targetId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (noteId: number) => deleteNote(noteId),
    onSuccess: () => qc.invalidateQueries({ queryKey: noteKey(targetType, targetId) }),
  })
}
