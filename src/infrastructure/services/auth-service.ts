/**
 * Implementación del servicio de autenticación usando Supabase.
 */

import { getCurrentUser as getSupabaseUser } from '../supabase/auth'
import type { User } from '@/domain/user'
import type { IAuthService } from '@/domain/services'

export interface AuthService {
  getCurrentUser(): Promise<User | null>
}

/**
 * Implementación de IAuthService usando Supabase Auth.
 */
export class SupabaseAuthService implements IAuthService {
  async getCurrentUser(): Promise<User | null> {
    return getSupabaseUser()
  }
}

// Factory para crear instancias
export function createAuthService(): AuthService {
  return new SupabaseAuthService()
}
