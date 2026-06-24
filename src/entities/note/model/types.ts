import type { components } from '#/shared/api'

export type PersonalNote = components['schemas']['PersonalNoteRead']

// Content kinds a note can attach to (legacy targetable types).
export type NoteTargetType = 'session' | 'file' | 'quiz' | 'text_lesson' | 'assignment'
