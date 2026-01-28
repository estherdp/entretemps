import { supabase } from './supabase-client'
import { User } from '@/domain/user'

export async function signInWithEmail(email: string): Promise<void> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/`,
    },
  })

  if (error) {
    throw new Error(`Error al enviar el enlace: ${error.message}`)
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  return {
    id: user.id,
    email: user.email || '',
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
