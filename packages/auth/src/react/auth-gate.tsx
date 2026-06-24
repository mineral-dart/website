import * as React from 'react'
import { hasRequiredRole } from '../roles'
import { LOGOUT_FLAG_KEY, login } from '../store'
import { useAuth } from './use-auth'

/** A logout is "recent" for this long, during which auto-login stays suppressed. */
const LOGOUT_GRACE_MS = 10_000

/** True once, right after a logout, so the post-logout landing skips auto-login. */
function consumeRecentLogout(): boolean {
  if (typeof window === 'undefined') return false
  const ts = sessionStorage.getItem(LOGOUT_FLAG_KEY)
  if (!ts) return false
  sessionStorage.removeItem(LOGOUT_FLAG_KEY)
  return Date.now() - Number(ts) < LOGOUT_GRACE_MS
}

interface AuthGateProps {
  requiredRoles?: string[]
  /** id of the sibling element holding the protected content (hidden by default). */
  contentId?: string
  /** id of the sibling element holding the not-found content shown when access is forbidden (hidden by default). */
  forbiddenId?: string
}

export function AuthGate({
  requiredRoles = [],
  contentId = 'protected-doc',
  forbiddenId,
}: AuthGateProps) {
  const { status, user } = useAuth()
  const authorized =
    status === 'authenticated' && hasRequiredRole(user?.roles ?? [], requiredRoles)
  const forbidden = status === 'authenticated' && !authorized

  React.useEffect(() => {
    const element = document.getElementById(contentId)
    if (element) element.hidden = !(status === 'disabled' || authorized)
  }, [status, authorized, contentId])

  React.useEffect(() => {
    if (!forbiddenId) return
    const element = document.getElementById(forbiddenId)
    if (element) element.hidden = !forbidden
  }, [forbidden, forbiddenId])

  React.useEffect(() => {
    if (status !== 'unauthenticated') return
    if (consumeRecentLogout()) {
      window.location.assign('/')
      return
    }
    void login()
  }, [status])

  if (status === 'disabled' || authorized || forbidden) return null

  if (status === 'loading') {
    return <GateMessage>Loading</GateMessage>
  }
  return <GateMessage>Authentication required</GateMessage>
}

function GateMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground" role="status">
      {children}
    </div>
  )
}
