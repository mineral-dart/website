import { resolveAuthConfig } from './config'
import type { AuthConfig } from './contracts'

/** Reads PUBLIC_* vars from the consuming app's Vite/Astro bundle. */
export function getClientAuthConfig(): AuthConfig {
  return resolveAuthConfig((import.meta as unknown as { env: Record<string, string | undefined> }).env)
}
