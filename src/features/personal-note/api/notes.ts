import type { NoteTargetType, PersonalNote } from '#/entities/note'
import { api } from '#/shared/api'

export interface SaveNoteInput {
  courseId: number
  targetType: NoteTargetType
  targetId: number
  note: string
  attachment?: File | null
}

// Fetch the user's note for an item; null when none exists (legacy 404 → not_found).
export async function getNote(
  targetType: NoteTargetType,
  targetId: number,
): Promise<PersonalNote | null> {
  const { data, error, response } = await api.GET('/api/v1/personal-notes', {
    params: { query: { type: targetType, item: targetId } },
  })
  if (response.status === 404) return null
  if (error) throw new Error('Не удалось загрузить заметку')
  return data
}

// Upsert a note (multipart; legacy CoursePersonalNotesController@store).
export async function saveNote(input: SaveNoteInput): Promise<PersonalNote> {
  const { data, error } = await api.POST('/api/v1/personal-notes', {
    body: {
      item_type: input.targetType,
      item_id: input.targetId,
      course_id: input.courseId,
      note: input.note,
    },
    bodySerializer: (body) => {
      const fd = new FormData()
      fd.append('item_type', body.item_type)
      fd.append('item_id', String(body.item_id))
      fd.append('course_id', String(body.course_id))
      fd.append('note', body.note)
      if (input.attachment) fd.append('attachment', input.attachment)
      return fd
    },
  })
  if (error) throw new Error('Не удалось сохранить заметку')
  return data
}

export async function deleteNote(noteId: number): Promise<void> {
  const { error } = await api.DELETE('/api/v1/personal-notes/delete/{note_id}', {
    params: { path: { note_id: noteId } },
  })
  if (error) throw new Error('Не удалось удалить заметку')
}
