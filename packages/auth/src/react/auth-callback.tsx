import * as React from 'react'
import { handleCallback } from '../store'

export function AuthCallback() {
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    handleCallback()
      .then((returnTo) => window.location.replace(returnTo))
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center text-muted-foreground">
      {error ? `Erreur d'authentification : ${error}` : 'Connexion en cours…'}
    </div>
  )
}
