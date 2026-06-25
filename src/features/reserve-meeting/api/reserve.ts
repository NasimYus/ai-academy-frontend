import { api } from '#/shared/api'

export async function reserveMeeting(meetingTimeId: number, description?: string) {
  const { data, error } = await api.POST('/api/v1/meetings/reserve', {
    body: {
      meeting_time_id: meetingTimeId,
      description: description ?? null,
      meeting_type: 'online',
    },
  })
  if (error) throw new Error('Не удалось забронировать')
  return data
}

// Create a pending order for a paid reservation, then settle it via /payments.
export async function payReservation(reserveId: number) {
  const { data, error } = await api.POST('/api/v1/meetings/reserve/{reserve_id}/pay', {
    params: { path: { reserve_id: reserveId } },
  })
  if (error) throw new Error('Не удалось оформить оплату')
  return data
}
