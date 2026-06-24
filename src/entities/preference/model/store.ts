import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { setPrefsGetter } from '#/shared/api'

interface PrefsState {
  locale: string
  currency: string
  setLocale: (locale: string) => void
  setCurrency: (currency: string) => void
}

// Content preferences: drive locale (F.4) and currency (F.5) on API responses.
export const usePrefsStore = create<PrefsState>()(
  persist(
    (set) => ({
      locale: 'en',
      currency: 'USD',
      setLocale: (locale) => set({ locale }),
      setCurrency: (currency) => set({ currency }),
    }),
    { name: 'ai-academy-prefs' },
  ),
)

// Bridge prefs into the API client (keeps `shared` decoupled from this entity).
setPrefsGetter(() => {
  const { locale, currency } = usePrefsStore.getState()
  return { locale, currency }
})
