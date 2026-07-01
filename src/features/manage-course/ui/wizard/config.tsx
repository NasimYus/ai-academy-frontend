import {
  Archive,
  ClipboardCheck,
  Cloud,
  FileText,
  Notebook,
  ScrollText,
  ShieldQuestion,
  Wallet,
} from 'lucide-react'

import type { LucideIcon } from 'lucide-react'
import type { components } from '#/shared/api'

export type CourseDetail = components['schemas']['CourseDetail']
export type CourseType = 'course' | 'webinar' | 'text_lesson'
export type VideoSource = '' | 'upload' | 'youtube' | 'vimeo' | 'external_link'

export interface WizardStep {
  key: string
  label: string
  icon: LucideIcon
}

// 8-step wizard, parity of the legacy progress bar (basic→reviewer).
export const STEPS: WizardStep[] = [
  { key: 'basic', label: 'Основная информация', icon: Notebook },
  { key: 'extra', label: 'Дополнительная информация', icon: FileText },
  { key: 'pricing', label: 'Цены', icon: Wallet },
  { key: 'content', label: 'Контент', icon: Cloud },
  { key: 'prerequisites', label: 'Предварительные требования', icon: Archive },
  { key: 'faq', label: 'Вопросы и ответы', icon: ScrollText },
  { key: 'quiz', label: 'Тест и сертификат', icon: ClipboardCheck },
  { key: 'reviewer', label: 'Сообщение рецензенту', icon: ShieldQuestion },
]

export interface WizardForm {
  // step 1 — basic
  type: CourseType
  locale: string
  teacher_id: string // admin-only: assigned instructor
  title: string
  seo_description: string
  thumbnail: string
  image_cover: string
  icon: string
  video_demo: string
  video_demo_source: VideoSource
  summary: string
  description: string
  // step 2 — extra
  category_id: string
  capacity: string
  start_date: string
  duration: string
  timezone: string
  forum: boolean
  support: boolean
  downloadable: boolean
  partner_instructor: boolean
  // step 3 — pricing
  price: string
  access_days: string
  subscribe: boolean
  // step 8 — reviewer
  message_for_reviewer: string
  rules: boolean
}

export function initialForm(course?: CourseDetail): WizardForm {
  return {
    type: course ? course.type : 'webinar',
    locale: course?.locale ?? 'ru',
    teacher_id: course?.teacher?.id ? String(course.teacher.id) : '',
    title: course?.title ?? '',
    seo_description: course?.seo_description ?? '',
    thumbnail: course?.image ?? '',
    image_cover: course?.image_cover ?? '',
    icon: course?.icon ?? '',
    video_demo: course?.video_demo ?? '',
    video_demo_source: course?.video_demo_source ?? '',
    summary: course?.summary ?? '',
    description: course?.description ?? '',
    category_id: course?.category_id ? String(course.category_id) : '',
    capacity: course?.capacity != null ? String(course.capacity) : '',
    start_date: toLocalInput(course?.start_date),
    duration: course?.duration != null ? String(course.duration) : '',
    timezone: course?.timezone ?? 'Asia/Dushanbe',
    forum: course?.forum ?? false,
    support: course?.support ?? false,
    downloadable: course?.downloadable ?? false,
    partner_instructor: false,
    price: course?.price != null ? String(course.price) : '0',
    access_days: course?.access_days != null ? String(course.access_days) : '',
    subscribe: course?.subscribe ?? false,
    message_for_reviewer: course?.message_for_reviewer ?? '',
    rules: false,
  }
}

function toLocalInput(iso?: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const num = (v: string): number | null => (v.trim() === '' ? null : Number(v))

// Step 1 → create payload (draft-first; only filled fields).
export function buildCreateBody(f: WizardForm, draft: boolean) {
  return {
    type: f.type,
    title: f.title,
    locale: f.locale,
    teacher_id: f.teacher_id ? Number(f.teacher_id) : null,
    summary: f.summary || null,
    description: f.description || null,
    seo_description: f.seo_description || null,
    thumbnail: f.thumbnail || null,
    image_cover: f.image_cover || null,
    icon: f.icon || null,
    video_demo: f.video_demo || null,
    video_demo_source: f.video_demo_source || null,
    price: 0,
    private: false,
    support: false,
    downloadable: false,
    partner_instructor: false,
    subscribe: false,
    forum: false,
    certificate: false,
    only_for_students: false,
    enable_waitlist: false,
    rules: false,
    draft,
  }
}

// The fields a given step persists via update.
export function buildStepBody(step: number, f: WizardForm): Record<string, unknown> {
  if (step === 1) {
    return {
      type: f.type,
      title: f.title,
      locale: f.locale,
      teacher_id: f.teacher_id ? Number(f.teacher_id) : null,
      summary: f.summary || null,
      description: f.description || null,
      seo_description: f.seo_description || null,
      thumbnail: f.thumbnail || null,
      image_cover: f.image_cover || null,
      icon: f.icon || null,
      video_demo: f.video_demo || null,
      video_demo_source: f.video_demo_source || null,
    }
  }
  if (step === 2) {
    return {
      category_id: num(f.category_id),
      capacity: num(f.capacity),
      duration: num(f.duration),
      timezone: f.timezone || null,
      start_date: f.type === 'webinar' && f.start_date ? new Date(f.start_date).toISOString() : null,
      forum: f.forum,
      support: f.support,
      downloadable: f.downloadable,
      partner_instructor: f.partner_instructor,
    }
  }
  if (step === 3) {
    return {
      price: num(f.price) ?? 0,
      access_days: num(f.access_days),
      subscribe: f.subscribe,
    }
  }
  return {}
}
