import createClient from 'openapi-fetch'

import type { paths } from '#/shared/api/schema'

// Single typed client generated from the FastAPI OpenAPI contract.
// Base URL points at the backend; paths/params/bodies are fully type-checked.
export const api = createClient<paths>({
  baseUrl: import.meta.env.VITE_API_URL ?? 'http://localhost:8000',
})

// The auth token is injected from above via `setAuthTokenGetter` so this
// `shared` module never imports from upper layers (FSD dependency rule).
let getAuthToken: () => string | null = () => null

export function setAuthTokenGetter(getter: () => string | null) {
  getAuthToken = getter
}

// Attach the JWT (if any) to every request.
api.use({
  onRequest({ request }) {
    const token = getAuthToken()
    if (token) request.headers.set('Authorization', `Bearer ${token}`)
    return request
  },
})
