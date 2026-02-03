import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Route Handler para procesar el callback de autenticación de Supabase.
 *
 * Este endpoint maneja el flujo PKCE:
 * 1. Recibe el código de autorización en los query params
 * 2. Intercambia el código por una sesión usando el PKCE verifier almacenado en cookies
 * 3. Establece las cookies de sesión
 * 4. Redirige al usuario a la página principal
 */
export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  console.log('[Auth Callback] Processing callback with code:', code ? 'present' : 'missing')

  if (code) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch (error) {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
              console.error('[Auth Callback] Error setting cookies:', error)
            }
          },
        },
      }
    )

    try {
      console.log('[Auth Callback] Exchanging code for session')

      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error('[Auth Callback] Error exchanging code:', error)

        // Handle PKCE errors specifically
        if (error.message.includes('PKCE') || error.message.includes('code_verifier')) {
          console.error('[Auth Callback] PKCE verifier not found - code may have been used already or cookies cleared')
          return NextResponse.redirect(
            `${origin}/login?error=pkce_error&message=${encodeURIComponent('El enlace ha expirado o fue usado en otro navegador. Solicita un nuevo enlace.')}`
          )
        }

        // Generic auth error
        return NextResponse.redirect(
          `${origin}/login?error=auth_error&message=${encodeURIComponent('Error al completar el inicio de sesión.')}`
        )
      }

      if (data.session) {
        console.log('[Auth Callback] Session established successfully for user:', data.user.email)

        // Successful authentication - redirect to home
        return NextResponse.redirect(`${origin}/`)
      }

      console.warn('[Auth Callback] No session returned after code exchange')
      return NextResponse.redirect(
        `${origin}/login?error=no_session&message=${encodeURIComponent('No se pudo establecer la sesión.')}`
      )
    } catch (err) {
      console.error('[Auth Callback] Unexpected error:', err)
      return NextResponse.redirect(
        `${origin}/login?error=unexpected&message=${encodeURIComponent('Error inesperado al procesar la autenticación.')}`
      )
    }
  }

  // No code provided - invalid callback
  console.warn('[Auth Callback] No code provided in callback URL')
  return NextResponse.redirect(
    `${origin}/login?error=invalid_callback&message=${encodeURIComponent('Enlace de autenticación inválido.')}`
  )
}
