// src/infrastructure/supabase/user-mapper.ts

import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { AuthProvider, User } from '@/domain/user'

function readString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

/**
 * Traduce el usuario de Supabase al modelo de dominio.
 *
 * El nombre visible se busca primero en el que el usuario eligió
 * (`display_name`) y después en los que aporta Google (`full_name`, `name`).
 */
export function toDomainUser(user: SupabaseUser): User {
  const metadata = user.user_metadata ?? {}
  const provider = user.app_metadata?.provider === 'google' ? 'google' : 'email'

  return {
    id: user.id,
    email: user.email ?? '',
    displayName: readString(metadata.display_name) ?? readString(metadata.full_name) ?? readString(metadata.name),
    provider: provider satisfies AuthProvider,
  }
}
