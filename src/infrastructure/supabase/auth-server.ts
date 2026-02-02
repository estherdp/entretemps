// src/infrastructure/supabase/auth-server.ts

/**
 * Funciones de autenticación para el servidor (API routes).
 *
 * IMPORTANTE: Este archivo solo debe importarse en API routes o Server Components,
 * nunca en Client Components.
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { User } from '@/domain/user'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Obtiene el usuario actual en el contexto del servidor (API routes).
 *
 * Esta función debe usarse en API routes de Next.js donde necesitamos
 * verificar la autenticación del usuario desde el servidor.
 *
 * Crea un cliente de Supabase específico para el servidor que puede
 * leer las cookies de autenticación.
 */
export async function getCurrentUserServer(): Promise<User | null> {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[getCurrentUserServer] Missing Supabase environment variables')
    return null
  }

  const supabaseServer = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })

  const {
    data: { session },
  } = await supabaseServer.auth.getSession()

  if (!session) {
    return null
  }

  return {
    id: session.user.id,
    email: session.user.email || '',
  }
}

/**
 * Crea un cliente de Supabase para el servidor (API routes).
 *
 * Este cliente puede leer las cookies de autenticación y debe usarse
 * en API routes cuando necesitas hacer queries autenticadas a Supabase.
 *
 * @returns Cliente de Supabase configurado para el servidor
 */
export async function createSupabaseServerClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('[createSupabaseServerClient] Missing Supabase environment variables')
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
}
