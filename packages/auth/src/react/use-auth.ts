import { useSyncExternalStore } from 'react'
import { getAuthState, subscribeAuth } from '../store'
import type { AuthState } from '../contracts'

// The SSR HTML is always produced from the initial "loading" state. The live
// store can already be resolved by the time the client hydrates, so hydration
// must read this same constant to match the server markup, not the live state.
const serverSnapshot: AuthState = { status: 'loading', user: null }

export function useAuth(): AuthState {
  return useSyncExternalStore(subscribeAuth, getAuthState, () => serverSnapshot)
}
