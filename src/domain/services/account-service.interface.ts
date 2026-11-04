// src/domain/services/account-service.interface.ts

/**
 * Puerto (Interface) para gestionar la cuenta del usuario autenticado.
 *
 * Opera siempre sobre la sesión actual: no recibe userId para que
 * ninguna implementación pueda modificar la cuenta de otro usuario.
 */
export interface IAccountService {
  updateDisplayName(displayName: string): Promise<void>

  /**
   * Borra la cuenta y todos sus datos (aventuras y registro de uso)
   * de forma irreversible, y cierra la sesión.
   */
  deleteAccount(): Promise<void>
}
