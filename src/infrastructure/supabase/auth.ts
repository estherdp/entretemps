import { supabase } from './supabase-client'
import { User } from '@/domain/user'
import { toDomainUser } from './user-mapper'
import { buildAuthCallbackUrl } from '@/lib/safe-redirect'

function siteOrigin(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin
}

export async function signInWithEmail(email: string, nextPath?: string | null): Promise<void> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: buildAuthCallbackUrl(siteOrigin(), nextPath),
      // Disable PKCE for magic link flow to avoid verifier issues
      // Magic links are already secure and don't need PKCE
      shouldCreateUser: true,
    },
  })

  if (error) {
    // Manejo específico de rate limit
    if (error.message.includes('rate limit')) {
      throw new Error(
        'Has solicitado demasiados enlaces. Por favor, espera unos minutos e inténtalo de nuevo.'
      )
    }

    // Manejo específico de email inválido
    if (error.message.includes('invalid') || error.message.includes('valid email')) {
      throw new Error('El email introducido no es válido.')
    }

    // Error genérico
    throw new Error(`Error al enviar el enlace: ${error.message}`)
  }
}

export async function getCurrentUser(): Promise<User | null> {
  // Primero obtener la sesión (esto carga desde localStorage si existe)
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  return toDomainUser(session.user)
}

/**
 * Inicia sesión con Google (OAuth). Redirige al proveedor y vuelve a
 * /auth/callback, que intercambia el código por la sesión.
 *
 * Requiere activar el proveedor Google en Supabase -> Authentication -> Providers.
 */
export async function signInWithGoogle(nextPath?: string | null): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: buildAuthCallbackUrl(siteOrigin(), nextPath),
    },
  })

  if (error) {
    throw new Error(`Error al iniciar sesión con Google: ${error.message}`)
  }
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut()

  if (error) {
    throw new Error(`Error al cerrar sesión: ${error.message}`)
  }
}

export function onAuthStateChange(
  callback: (user: User | null) => void
): () => void {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ? toDomainUser(session.user) : null)
  })

  return () => {
    subscription.unsubscribe()
  }
}
