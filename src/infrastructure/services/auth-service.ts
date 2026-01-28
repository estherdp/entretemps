/**
 * Servicio de autenticación
 * Abstrae la lógica de autenticación para permitir inyección de dependencias
 */

import { getCurrentUser as getSupabaseUser } from '../supabase/auth'
import type { User } from '@/domain/user'

export interface AuthService {
  getCurrentUser(): Promise<User | null>
}

export class SupabaseAuthService implements AuthService {
  async getCurrentUser(): Promise<User | null> {
    return getSupabaseUser()
  }
}

// Factory para crear instancias
export function createAuthService(): AuthService {
  return new SupabaseAuthService()
}
