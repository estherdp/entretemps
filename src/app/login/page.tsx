'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { signInWithEmail, signInWithGoogle } from '@/infrastructure/supabase/auth'
import { Button } from '@/ui/components/button'
import { Input } from '@/ui/components/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/card'
import { AdventureIllustration } from '@/ui/components/adventure-illustration'

// Login con Google: requiere configurar OAuth en Google Cloud y en Supabase.
const GOOGLE_LOGIN_ENABLED = process.env.NEXT_PUBLIC_ENABLE_GOOGLE_LOGIN === 'true'

/** Marco de las pantallas de acceso: ilustración a un lado, formulario al otro. */
function AuthFrame({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-12 px-4 py-12 lg:grid-cols-2">
      <div className="hidden space-y-6 lg:block">
        <p className="font-hand text-3xl text-tomato">¡Hola, familia exploradora!</p>
        <h1 className="text-5xl leading-[1.05]">
          Tu próxima aventura empieza con <span className="marker">un enlace mágico</span>
        </h1>
        <div className="washi sticker w-[85%] -rotate-2 overflow-hidden" aria-hidden="true">
          <div className="aspect-[400/260]">
            <AdventureIllustration type="fantasy" place="home" />
          </div>
        </div>
      </div>
      <div className="mx-auto w-full max-w-md">{children}</div>
    </main>
  )
}

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
      <AuthFrame>
        <Card className="rotate-1">
          <CardHeader className="items-center text-center">
            <span className="stamp mb-2 h-20 w-20 bg-paper text-lg text-forest">¡Enviado!</span>
            <CardTitle>Revisa tu email</CardTitle>
            <CardDescription>
              Te hemos enviado un enlace mágico a <strong className="text-ink">{email}</strong>. Haz clic en el enlace
              para iniciar sesión.
            </CardDescription>
          </CardHeader>
        </Card>
      </AuthFrame>
    )
  }

  return (
    <AuthFrame>
      <Card>
        <CardHeader>
          <p className="font-hand text-xl text-tomato">Sin contraseñas</p>
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
              <div className="flex items-center gap-3 font-hand text-lg text-ink-soft">
                <span className="h-0 flex-1 border-t-2 border-dashed border-ink/30" />
                o con tu email
                <span className="h-0 flex-1 border-t-2 border-dashed border-ink/30" />
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
              <p role="alert" className="text-sm font-bold text-tomato">{error}</p>
            )}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Enviando...' : 'Enviar enlace'}
            </Button>
          </form>
          <p className="text-center text-xs text-ink-soft">
            Solo guardamos tu email. Nunca pedimos datos de los niños.
          </p>
        </CardContent>
      </Card>
    </AuthFrame>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center p-4">
        <p className="font-hand text-2xl text-ink-soft">Cargando...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
