import type { PageAccess, PageAuth } from './contracts'

export interface MetaLike {
  auth?: PageAuth
}

/**
 * Resolve whether a page is protected and which roles it needs.
 * Precedence: page frontmatter `auth` > nearest ancestor folder `_meta` `auth` > public.
 * A page is protected only when the resolved `auth.enabled` is true; the role
 * strategy is always "at least one of the listed roles".
 */
export function resolvePageAccess(
  entryId: string,
  frontmatterAuth: PageAuth | undefined,
  metaByPath: Record<string, MetaLike>,
): PageAccess {
  const auth = frontmatterAuth ?? inheritedAuth(entryId, metaByPath)
  if (!auth?.enabled) {
    return { enabled: false, roles: [] }
  }
  return { enabled: true, roles: auth.roles ?? [] }
}

function inheritedAuth(
  entryId: string,
  metaByPath: Record<string, MetaLike>,
): PageAuth | undefined {
  const parts = entryId.replace(/\.mdx$/, '').split('/')
  for (let i = parts.length - 1; i >= 1; i--) {
    const folderPath = parts.slice(0, i).join('/')
    const meta = metaByPath[folderPath]
    if (meta?.auth) {
      return meta.auth
    }
  }
  return undefined
}
