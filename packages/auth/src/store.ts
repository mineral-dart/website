import { UserManager, type User } from 'oidc-client-ts'
import type { AuthConfig, AuthState, AuthUser } from './contracts'
import { getUserRoles } from './roles'

/**
 * Set just before a logout redirect so the post-logout landing can suppress the
 * protected-page auto-login. Needed because some IdPs (e.g. FerrisKey 0.6.0)
 * keep their SSO cookie and bounce back to the app instead of honoring
 * post_logout_redirect_uri, which would otherwise silently re-authenticate.
 */
export const LOGOUT_FLAG_KEY = 'auth:logged-out'

let manager: UserManager | null = null
let rolesClaim = 'realm_access.roles'
let endSessionEndpoint: string | undefined
let postLogoutRedirectUri = '/'
let state: AuthState = { status: 'loading', user: null }
const listeners = new Set<() => void>()

function emit(): void {
  for (const l of listeners) l()
}

function setState(next: AuthState): void {
  state = next
  emit()
}

function toAbsolute(uri: string): string {
  if (/^https?:\/\//.test(uri)) return uri
  if (typeof window === 'undefined') return uri
  return `${window.location.origin}${uri.startsWith('/') ? '' : '/'}${uri}`
}

function toAuthUser(user: User): AuthUser {
  const profile = user.profile as Record<string, unknown>
  return {
    sub: user.profile.sub,
    name: user.profile.name,
    email: user.profile.email,
    roles: getUserRoles(profile, user.access_token, rolesClaim),
    accessToken: user.access_token,
    expiresAt: user.expires_at,
  }
}

/** Idempotent. Call once per page from the React entry. */
export function initAuth(cfg: AuthConfig): void {
  if (!cfg.enabled || !cfg.oidc) {
    setState({ status: 'disabled', user: null })
    return
  }
  if (manager) return

  const o = cfg.oidc
  rolesClaim = o.rolesClaim
  endSessionEndpoint = o.endSessionEndpoint
  postLogoutRedirectUri = toAbsolute(o.postLogoutRedirectUri)
  manager = new UserManager({
    authority: o.issuer,
    client_id: o.clientId,
    redirect_uri: toAbsolute(o.redirectUri),
    post_logout_redirect_uri: toAbsolute(o.postLogoutRedirectUri),
    silent_redirect_uri: o.silentRedirectUri ? toAbsolute(o.silentRedirectUri) : undefined,
    response_type: 'code',
    scope: o.scope,
    automaticSilentRenew: Boolean(o.silentRedirectUri),
    ...(o.audience ? { extraQueryParams: { audience: o.audience } } : {}),
  })

  manager.events.addUserLoaded((u) => setState({ status: 'authenticated', user: toAuthUser(u) }))
  manager.events.addUserUnloaded(() => setState({ status: 'unauthenticated', user: null }))
  manager.events.addAccessTokenExpired(() => {
    void manager?.signinSilent().catch(() => setState({ status: 'unauthenticated', user: null }))
  })

  void manager
    .getUser()
    .then((u) => {
      if (u && !u.expired) setState({ status: 'authenticated', user: toAuthUser(u) })
      else setState({ status: 'unauthenticated', user: null })
    })
    .catch(() => setState({ status: 'unauthenticated', user: null }))
}

export function getAuthState(): AuthState {
  return state
}

export function subscribeAuth(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export async function login(returnTo?: string): Promise<void> {
  if (!manager) return
  const target = returnTo ?? (typeof window !== 'undefined' ? window.location.href : '/')
  await manager.signinRedirect({ state: { returnTo: target } })
}

export async function logout(): Promise<void> {
  if (!manager) return

  if (typeof window !== 'undefined') {
    sessionStorage.setItem(LOGOUT_FLAG_KEY, String(Date.now()))
  }

  // Prefer a discovered end_session_endpoint; fall back to the configured one
  // for IdPs (e.g. FerrisKey) that don't advertise it in their discovery doc.
  const discovered = await manager.metadataService.getEndSessionEndpoint().catch(() => undefined)
  const endpoint = discovered ?? endSessionEndpoint

  const user = await manager.getUser()
  await manager.removeUser()

  if (typeof window === 'undefined') return

  // Without an endpoint or id token we can only clear the local session.
  if (!endpoint || !user?.id_token) {
    window.location.assign(postLogoutRedirectUri)
    return
  }

  const params = new URLSearchParams({
    id_token_hint: user.id_token,
    post_logout_redirect_uri: postLogoutRedirectUri,
  })
  window.location.assign(`${endpoint}?${params.toString()}`)
}

/** Completes the OIDC redirect; resolves to the URL to return the user to. */
export async function handleCallback(): Promise<string> {
  if (!manager) return '/'
  const user = await manager.signinCallback()
  const returnTo = (user?.state as { returnTo?: string } | undefined)?.returnTo
  return returnTo ?? '/'
}

export async function handleSilentCallback(): Promise<void> {
  if (!manager) return
  await manager.signinSilentCallback()
}
