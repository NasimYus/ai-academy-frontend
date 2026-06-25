import { api } from '#/shared/api'
import type { components } from '#/shared/api'

export type MeetingConfigInput = components['schemas']['MeetingConfigInput']
export type DayLabel = components['schemas']['DayLabel']

export async function updateMeeting(body: MeetingConfigInput) {
  const { data, error } = await api.PUT('/api/v1/panel/meeting', { body })
  if (error) throw new Error('Не удалось сохранить настройки')
  return data
}

export async function addSlot(dayLabel: DayLabel, time: string) {
  const { data, error } = await api.POST('/api/v1/panel/meeting/times', {
    body: { day_label: dayLabel, time },
  })
  if (error) throw new Error('Не удалось добавить слот')
  return data
}

export async function deleteSlot(timeId: number) {
  const { error } = await api.DELETE('/api/v1/panel/meeting/times/{time_id}', {
    params: { path: { time_id: timeId } },
  })
  if (error) throw new Error('Не удалось удалить слот')
}

export async function finishReservation(reserveId: number) {
  const { error } = await api.POST('/api/v1/panel/meetings/{reserve_id}/finish', {
    params: { path: { reserve_id: reserveId } },
  })
  if (error) throw new Error('Не удалось завершить встречу')
}
