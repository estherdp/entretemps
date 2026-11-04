'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { signInWithEmail, signInWithGoogle } from '@/infrastructure/supabase/auth'
import { Button } from '@/ui/components/button'
import { Input } from '@/ui/components/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/card'

// Login con Google: requiere configurar OAuth en Google Cloud y en Supabase.
const GOOGLE_LOGIN_ENABLED = process.env.NEXT_PUBLIC_ENABLE_GOOGLE_LOGIN === 'true'

function LoginForm() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const nextPath = searchParams.get('next')

  // Check for error from callback
  useEffect(() => {
    const errorParam = searchParams.get('error')
    const messageParam = searchParams.get('message')

    if (errorParam) {
      // Use custom message if provided, otherwise use default messages
      if (messageParam) {
        setError(decodeURIComponent(messageParam))
      } else if (errorParam === 'pkce_error') {
        setError('El enlace ha expirado o fue usado en otro navegador. Por favor, solicita un nuevo enlace.')
      } else if (errorParam === 'auth_error' || errorParam === 'auth_failed') {
        setError('Error al completar el inicio de sesión. Por favor, solicita un nuevo enlace.')
      } else if (errorParam === 'no_session') {
        setError('No se pudo establecer la sesión. Por favor, intenta de nuevo.')
      } else if (errorParam === 'invalid_callback') {
        setError('Enlace de autenticación inválido. Por favor, solicita un nuevo enlace.')
      } else {
        setError('Error al procesar la autenticación. Por favor, intenta de nuevo.')
      }
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await signInWithEmail(email, nextPath)
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar el enlace')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError(null)
    try {
      await signInWithGoogle(nextPath)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión con Google')
    }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Revisa tu email</CardTitle>
            <CardDescription>
              Te hemos enviado un enlace mágico a {email}. Haz clic en el enlace
              para iniciar sesión.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Iniciar sesión</CardTitle>
          <CardDescription>
            {GOOGLE_LOGIN_ENABLED
              ? 'Entra con Google o recibe un enlace de acceso en tu email'
              : 'Introduce tu email para recibir un enlace de acceso'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {GOOGLE_LOGIN_ENABLED && (
            <>
              <Button type="button" variant="outline" className="w-full" onClick={handleGoogle} disabled={loading}>
                <svg aria-hidden="true" viewBox="0 0 24 24" className="w-4 h-4">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.94l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
                </svg>
                Continuar con Google
              </Button>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                o con tu email
                <span className="h-px flex-1 bg-border" />
              </div>
            </>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Cargando...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
