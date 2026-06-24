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

// Attach the session JWT (if any) to every request. An explicit per-call
// Authorization header wins (register/login fetch /auth/me with a fresh token
// before the session store is updated — don't clobber it with a stale token).
api.use({
  onRequest({ request }) {
    const token = getAuthToken()
    if (token && !request.headers.has('Authorization')) {
      request.headers.set('Authorization', `Bearer ${token}`)
    }
    return request
  },
})

// Pass the chosen locale/currency as headers so the backend localizes content
// (F.4) and prices (F.5). Headers are mutated in place — rebuilding the Request
// (to add query params) breaks POST bodies in the browser.
api.use({
  onRequest({ request }) {
    const { locale, currency } = getPrefs()
    if (locale) request.headers.set('Accept-Language', locale)
    if (currency) request.headers.set('X-Currency', currency)
    return request
  },
})
