export interface OidcConfig {
  issuer: string
  clientId: string
  /** Absolute URL or path (resolved against window.location.origin at runtime). */
  redirectUri: string
  postLogoutRedirectUri: string
  silentRedirectUri?: string
  scope: string
  /** Dot-path into token claims where roles live (e.g. "realm_access.roles"). */
  rolesClaim: string
  audience?: string
  /**
   * RP-initiated logout endpoint. Used only when the IdP discovery document
   * omits `end_session_endpoint` (e.g. FerrisKey); otherwise the discovered one
   * wins. Defaults to the Keycloak-convention path derived from the issuer.
   */
  endSessionEndpoint: string
}

export interface AuthConfig {
  enabled: boolean
  oidc?: OidcConfig
}

export interface AuthUser {
  sub: string
  name?: string
  email?: string
  roles: string[]
  accessToken: string
  expiresAt?: number
}

export type AuthStatus = 'disabled' | 'loading' | 'unauthenticated' | 'authenticated'

export interface AuthState {
  status: AuthStatus
  user: AuthUser | null
  error?: string
}

/** Auth block as written in page frontmatter or a folder `_meta.json`. */
export interface PageAuth {
  enabled?: boolean
  roles?: string[]
}

export interface PageAccess {
  /** Whether the page is protected. When false, the page is public. */
  enabled: boolean
  /** Required roles; a user needs at least one. Empty => any authenticated user. */
  roles: string[]
}
