import { useMutation } from '@tanstack/react-query'

import { useOAuthLogin } from '#/features/auth/oauth/model/use-oauth'
import type { OAuthProfile, OAuthProvider } from '#/features/auth/oauth/api/oauth'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID as string | undefined

// Obtain the provider profile via its JS SDK. Wired once client IDs are set;
// the buttons below only render when the matching env var is present.
async function acquireProfile(_provider: OAuthProvider): Promise<OAuthProfile> {
  throw new Error('Провайдер не настроен: подключите SDK и client_id')
}

const btnCls =
  'rounded-lg border border-brand-200 px-4 py-2 text-sm font-medium text-ink transition hover:bg-brand-50 disabled:opacity-50'

export function OAuthButtons() {
  const oauthLogin = useOAuthLogin()
  const flow = useMutation({
    mutationFn: async (provider: OAuthProvider) => {
      const profile = await acquireProfile(provider)
      await oauthLogin(provider, profile)
    },
  })

  if (!GOOGLE_CLIENT_ID && !FACEBOOK_APP_ID) return null

  return (
    <div className="mt-4 flex flex-col gap-2">
      <div className="text-center text-xs text-ink/40">или войдите через</div>
      <div className="flex gap-2">
        {GOOGLE_CLIENT_ID && (
          <button type="button" className={btnCls} disabled={flow.isPending} onClick={() => flow.mutate('google')}>
            Google
          </button>
        )}
        {FACEBOOK_APP_ID && (
          <button type="button" className={btnCls} disabled={flow.isPending} onClick={() => flow.mutate('facebook')}>
            Facebook
          </button>
        )}
      </div>
      {flow.isError && <p className="text-sm text-red-600">{flow.error.message}</p>}
    </div>
  )
}
