import * as React from 'react'
import { handleSilentCallback } from '../store'

export function AuthSilent() {
  React.useEffect(() => void handleSilentCallback(), [])
  return null
}
