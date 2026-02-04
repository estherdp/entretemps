import { supabase } from './supabase-client'
import { User } from '@/domain/user'

export async function signInWithEmail(email: string): Promise<void> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
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

  return {
    id: session.user.id,
    email: session.user.email || '',
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
    const user = session?.user
    if (user) {
      callback({
        id: user.id,
        email: user.email || '',
      })
    } else {
      callback(null)
    }
  })

  return () => {
    subscription.unsubscribe()
  }
}
