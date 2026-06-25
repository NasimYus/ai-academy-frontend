import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  ADMIN_USERS_KEY,
  banUser,
  setUserRole,
  unbanUser,
} from '#/features/manage-users/api/users'

function useUsersInvalidate() {
  const qc = useQueryClient()
  return () => void qc.invalidateQueries({ queryKey: ADMIN_USERS_KEY })
}

export function useBanUser() {
  const invalidate = useUsersInvalidate()
  return useMutation({
    mutationFn: (vars: { userId: number; days: number | null }) => banUser(vars.userId, vars.days),
    onSuccess: invalidate,
  })
}

export function useUnbanUser() {
  const invalidate = useUsersInvalidate()
  return useMutation({ mutationFn: (userId: number) => unbanUser(userId), onSuccess: invalidate })
}

export function useSetUserRole() {
  const invalidate = useUsersInvalidate()
  return useMutation({
    mutationFn: (vars: { userId: number; roleId: number }) => setUserRole(vars.userId, vars.roleId),
    onSuccess: invalidate,
  })
}
