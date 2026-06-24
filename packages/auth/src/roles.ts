export function getByPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

export function extractRoles(claims: Record<string, unknown>, claimPath: string): string[] {
  const value = getByPath(claims, claimPath)
  if (Array.isArray(value)) return value.filter((v): v is string => typeof v === 'string')
  if (typeof value === 'string') return value.split(/[\s,]+/).filter(Boolean)
  return []
}

function base64UrlDecode(input: string): string {
  const pad = input.length % 4 === 0 ? '' : '='.repeat(4 - (input.length % 4))
  const base64 = (input + pad).replace(/-/g, '+').replace(/_/g, '/')
  if (typeof atob === 'function') {
    const binary = atob(base64)
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  }
  return Buffer.from(base64, 'base64').toString('utf-8')
}

export function decodeJwt(token: string): Record<string, unknown> {
  const parts = token.split('.')
  if (parts.length < 2) return {}
  try {
    return JSON.parse(base64UrlDecode(parts[1])) as Record<string, unknown>
  } catch {
    return {}
  }
}

export function getUserRoles(
  profile: Record<string, unknown>,
  accessToken: string | undefined,
  claimPath: string,
): string[] {
  const fromProfile = extractRoles(profile, claimPath)
  const fromAccess = accessToken ? extractRoles(decodeJwt(accessToken), claimPath) : []
  return Array.from(new Set([...fromProfile, ...fromAccess]))
}

export function hasRequiredRole(userRoles: string[], required: string[]): boolean {
  if (required.length === 0) return true
  const set = new Set(userRoles)
  return required.some((r) => set.has(r))
}
