import { describe, it, expect } from 'vitest'
import { resolveAuthConfig } from './config'

describe('resolveAuthConfig', () => {
  it('returns disabled when PUBLIC_AUTH_ENABLED is not "true"', () => {
    expect(resolveAuthConfig({})).toEqual({ enabled: false })
    expect(resolveAuthConfig({ PUBLIC_AUTH_ENABLED: 'false' })).toEqual({ enabled: false })
  })

  it('throws when enabled but issuer/clientId missing', () => {
    expect(() => resolveAuthConfig({ PUBLIC_AUTH_ENABLED: 'true' })).toThrow(/ISSUER/)
  })

  it('builds config with defaults when enabled', () => {
    const cfg = resolveAuthConfig({
      PUBLIC_AUTH_ENABLED: 'true',
      PUBLIC_OIDC_ISSUER: 'https://kc.example.com/realms/r',
      PUBLIC_OIDC_CLIENT_ID: 'docs',
    })
    expect(cfg.enabled).toBe(true)
    expect(cfg.oidc).toMatchObject({
      issuer: 'https://kc.example.com/realms/r',
      clientId: 'docs',
      redirectUri: '/auth/callback',
      postLogoutRedirectUri: '/',
      silentRedirectUri: '/auth/silent',
      scope: 'openid profile email',
      rolesClaim: 'realm_access.roles',
    })
    expect(cfg.oidc?.audience).toBeUndefined()
    expect(cfg.oidc?.endSessionEndpoint).toBe(
      'https://kc.example.com/realms/r/protocol/openid-connect/logout',
    )
  })

  it('honors an explicit end-session endpoint override', () => {
    const cfg = resolveAuthConfig({
      PUBLIC_AUTH_ENABLED: 'true',
      PUBLIC_OIDC_ISSUER: 'https://i',
      PUBLIC_OIDC_CLIENT_ID: 'c',
      PUBLIC_OIDC_END_SESSION_ENDPOINT: 'https://i/custom/logout',
    })
    expect(cfg.oidc?.endSessionEndpoint).toBe('https://i/custom/logout')
  })

  it('honors explicit overrides', () => {
    const cfg = resolveAuthConfig({
      PUBLIC_AUTH_ENABLED: 'true',
      PUBLIC_OIDC_ISSUER: 'https://i',
      PUBLIC_OIDC_CLIENT_ID: 'c',
      PUBLIC_OIDC_REDIRECT_URI: 'https://app/cb',
      PUBLIC_OIDC_SCOPE: 'openid roles',
      PUBLIC_OIDC_ROLES_CLAIM: 'roles',
      PUBLIC_OIDC_AUDIENCE: 'docs-api',
    })
    expect(cfg.oidc).toMatchObject({
      redirectUri: 'https://app/cb',
      scope: 'openid roles',
      rolesClaim: 'roles',
      audience: 'docs-api',
    })
  })
})
