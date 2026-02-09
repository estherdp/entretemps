// src/domain/services/auth-service.interface.ts

import type { User } from '@/domain/user'

/**
 * Interfaz del servicio de autenticación.
 *
 * Define el contrato para operaciones de autenticación
 * sin acoplar el dominio a ninguna implementación concreta.
 */
export interface IAuthService {
  /**
   * Obtiene el usuario actualmente autenticado.
   *
   * @returns Usuario autenticado o null si no hay sesión
   */
  getCurrentUser(): Promise<User | null>
}
