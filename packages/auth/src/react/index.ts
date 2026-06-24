import { initAuth } from '../store'
import { getClientAuthConfig } from '../config-client'

// Initialize the shared store once, in the browser, regardless of which island
// imports this barrel first. initAuth is idempotent.
if (typeof window !== 'undefined') {
  initAuth(getClientAuthConfig())
}

export { useAuth } from './use-auth'
export { AuthGate } from './auth-gate'
export { AuthButton } from './auth-button'
export { AuthCallback } from './auth-callback'
export { AuthSilent } from './auth-silent'
export { login, logout } from '../store'
