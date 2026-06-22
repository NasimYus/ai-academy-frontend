import { QueryClient } from '@tanstack/react-query'

// Builds the per-request router context. The QueryClient is shared between the
// router (SSR query integration) and the React tree.
export function getContext() {
  const queryClient = new QueryClient()

  return {
    queryClient,
  }
}
