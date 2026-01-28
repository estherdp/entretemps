/**
 * Caso de uso: Obtener datos del usuario actual
 * Obtiene el usuario autenticado actual
 */

import type { AuthService } from '@/infrastructure/services/auth-service'
import type { User } from '@/domain/user'

export async function getCurrentUserData(
  authService: AuthService
): Promise<User | null> {
  return authService.getCurrentUser()
}
