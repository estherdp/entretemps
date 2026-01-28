'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/infrastructure/supabase/supabase-client'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')

      if (code) {
        // El cliente SSR de Supabase maneja automáticamente el intercambio de código
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
          console.error('Error al intercambiar código:', error)
          router.push('/login?error=auth_failed')
          return
        }
      }

      // Redirigir a home
      router.push('/')
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Completando inicio de sesión...</p>
    </div>
  )
}
