'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { signInWithEmail } from '@/infrastructure/supabase/auth'
import { Button } from '@/ui/components/button'
import { Input } from '@/ui/components/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/components/card'

function LoginForm() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check for error from callback
  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam === 'auth_failed') {
      setError('Error al completar el inicio de sesión. Por favor, solicita un nuevo enlace.')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await signInWithEmail(email)
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar el enlace')
    } finally {
      setLoading(false)
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
            Introduce tu email para recibir un enlace de acceso
          </CardDescription>
        </CardHeader>
        <CardContent>
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
