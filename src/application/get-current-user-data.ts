/**
 * Caso de uso: Obtener datos del usuario actual
 * Obtiene el usuario autenticado actual
 */

import type { IAuthService } from '@/domain/services'
import type { User } from '@/domain/user'

export async function getCurrentUserData(
  authService: IAuthService
): Promise<User | null> {
  return authService.getCurrentUser()
}
