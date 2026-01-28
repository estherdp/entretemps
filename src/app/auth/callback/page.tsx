'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/infrastructure/supabase/supabase-client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check for code in query parameters
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')

        // Check for tokens in hash (fallback for different auth flows)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')

        if (code) {
          // Exchange code for session
          const { error } = await supabase.auth.exchangeCodeForSession(code)

          if (error) {
            console.error('Error al intercambiar código:', error)
            setError('Error al completar el inicio de sesión. Por favor, intenta de nuevo.')
            setTimeout(() => router.push('/login'), 3000)
            return
          }
        } else if (accessToken && refreshToken) {
          // Set session from tokens in hash
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (error) {
            console.error('Error al establecer sesión:', error)
            setError('Error al completar el inicio de sesión. Por favor, intenta de nuevo.')
            setTimeout(() => router.push('/login'), 3000)
            return
          }
        }

        // Wait a moment to ensure session is fully established
        await new Promise(resolve => setTimeout(resolve, 500))

        // Verify session is established
        const { data: { session } } = await supabase.auth.getSession()

        if (session) {
          // Success - redirect to home
          router.push('/')
        } else {
          setError('No se pudo establecer la sesión. Por favor, intenta de nuevo.')
          setTimeout(() => router.push('/login'), 3000)
        }
      } catch (err) {
        console.error('Error en callback:', err)
        setError('Error inesperado. Por favor, intenta de nuevo.')
        setTimeout(() => router.push('/login'), 3000)
      }
    }

    handleCallback()
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <p className="text-red-600">{error}</p>
          <p className="text-sm text-muted-foreground">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Completando inicio de sesión...</p>
    </div>
  )
}
