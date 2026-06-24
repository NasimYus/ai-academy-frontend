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

// Content preferences (locale/currency) are injected from above, like the token.
let getPrefs: () => { locale?: string; currency?: string } = () => ({})

export function setPrefsGetter(getter: () => { locale?: string; currency?: string }) {
  getPrefs = getter
}

// Attach the JWT (if any) to every request.
api.use({
  onRequest({ request }) {
    const token = getAuthToken()
    if (token) request.headers.set('Authorization', `Bearer ${token}`)
    return request
  },
})

// Append the chosen locale/currency as query params so the backend localizes
// content (F.4) and prices (F.5). Explicit params on a call take precedence.
api.use({
  onRequest({ request }) {
    const { locale, currency } = getPrefs()
    const url = new URL(request.url)
    if (locale && !url.searchParams.has('locale')) url.searchParams.set('locale', locale)
    if (currency && !url.searchParams.has('currency')) url.searchParams.set('currency', currency)
    return new Request(url, request)
  },
})
