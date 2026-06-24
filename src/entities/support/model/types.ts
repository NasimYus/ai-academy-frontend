import type { components } from '#/shared/api'

export type SupportDetail = components['schemas']['SupportDetail']
export type SupportIndex = components['schemas']['SupportIndex']
export type SupportConversation =
  components['schemas']['SupportConversationRead']
export type SupportDepartment = components['schemas']['SupportDepartmentRead']
export type SupportType = components['schemas']['SupportType']
export type SupportStatus = SupportDetail['status']
