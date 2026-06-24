import { describe, it, expect } from 'vitest'
import { getByPath, extractRoles, decodeJwt, getUserRoles, hasRequiredRole } from './roles'

function makeJwt(payload: Record<string, unknown>): string {
  const b64 = (o: unknown) =>
    Buffer.from(JSON.stringify(o)).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  return `${b64({ alg: 'RS256' })}.${b64(payload)}.sig`
}

describe('getByPath', () => {
  it('reads nested dot paths', () => {
    expect(getByPath({ a: { b: { c: 1 } } }, 'a.b.c')).toBe(1)
    expect(getByPath({ a: 1 }, 'a.b')).toBeUndefined()
  })
})

describe('extractRoles', () => {
  it('reads an array claim', () => {
    expect(extractRoles({ realm_access: { roles: ['devops', 'admin'] } }, 'realm_access.roles')).toEqual([
      'devops',
      'admin',
    ])
  })
  it('splits a space/comma string claim', () => {
    expect(extractRoles({ roles: 'devops admin' }, 'roles')).toEqual(['devops', 'admin'])
    expect(extractRoles({ roles: 'devops,admin' }, 'roles')).toEqual(['devops', 'admin'])
  })
  it('returns [] when missing', () => {
    expect(extractRoles({}, 'realm_access.roles')).toEqual([])
  })
})

describe('decodeJwt', () => {
  it('decodes the payload', () => {
    const token = makeJwt({ sub: 'u1', realm_access: { roles: ['devops'] } })
    expect(decodeJwt(token)).toMatchObject({ sub: 'u1', realm_access: { roles: ['devops'] } })
  })
  it('returns {} on garbage', () => {
    expect(decodeJwt('not-a-jwt')).toEqual({})
  })
})

describe('getUserRoles', () => {
  it('merges roles from access token and profile', () => {
    const token = makeJwt({ realm_access: { roles: ['devops'] } })
    const roles = getUserRoles({ realm_access: { roles: ['admin'] } }, token, 'realm_access.roles')
    expect(roles.sort()).toEqual(['admin', 'devops'])
  })
})

describe('hasRequiredRole', () => {
  it('public when no roles required', () => {
    expect(hasRequiredRole([], [])).toBe(true)
  })
  it('passes when the user has at least one required role', () => {
    expect(hasRequiredRole(['devops'], ['devops', 'admin'])).toBe(true)
    expect(hasRequiredRole(['reader'], ['devops'])).toBe(false)
  })
})
