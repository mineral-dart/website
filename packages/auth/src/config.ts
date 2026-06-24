import type { AuthConfig } from './contracts'

type Env = Record<string, string | boolean | undefined>

function str(v: unknown): string | undefined {
  return typeof v === 'string' && v.length > 0 ? v : undefined
}

export function resolveAuthConfig(env: Env): AuthConfig {
  if (String(env.PUBLIC_AUTH_ENABLED) !== 'true') {
    return { enabled: false }
  }

  const issuer = str(env.PUBLIC_OIDC_ISSUER)
  const clientId = str(env.PUBLIC_OIDC_CLIENT_ID)
  if (!issuer || !clientId) {
    throw new Error(
      '[auth] PUBLIC_AUTH_ENABLED is "true" but PUBLIC_OIDC_ISSUER and/or PUBLIC_OIDC_CLIENT_ID are missing',
    )
  }

  return {
    enabled: true,
    oidc: {
      issuer,
      clientId,
      redirectUri: str(env.PUBLIC_OIDC_REDIRECT_URI) ?? '/auth/callback',
      postLogoutRedirectUri: str(env.PUBLIC_OIDC_POST_LOGOUT_REDIRECT_URI) ?? '/',
      silentRedirectUri: str(env.PUBLIC_OIDC_SILENT_REDIRECT_URI) ?? '/auth/silent',
      scope: str(env.PUBLIC_OIDC_SCOPE) ?? 'openid profile email',
      rolesClaim: str(env.PUBLIC_OIDC_ROLES_CLAIM) ?? 'realm_access.roles',
      audience: str(env.PUBLIC_OIDC_AUDIENCE),
      endSessionEndpoint:
        str(env.PUBLIC_OIDC_END_SESSION_ENDPOINT) ??
        `${issuer.replace(/\/$/, '')}/protocol/openid-connect/logout`,
    },
  }
}
