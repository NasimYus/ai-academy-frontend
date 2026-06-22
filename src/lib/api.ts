import createClient from 'openapi-fetch'

import type { paths } from '#/api/schema'
import { useAuthStore } from '#/stores/auth'

// Single typed client generated from the FastAPI OpenAPI contract.
// Base URL points at the backend; paths/params/bodies are fully type-checked.
export const api = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
})

// Attach the JWT (if any) to every request.
api.use({
  onRequest({ request }) {
    const token = useAuthStore.getState().token
    if (token) request.headers.set('Authorization', `Bearer ${token}`)
    return request
  },
})
