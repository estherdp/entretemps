// src/domain/repositories/generation-usage-repository.interface.ts

export type GenerationKind = 'adventure' | 'mission'

/**
 * Puerto (Interface) para registrar el uso de IA por usuario.
 *
 * Permite aplicar cuotas sin acoplar los casos de uso a la base de datos.
 */
export interface IGenerationUsageRepository {
  /**
   * Cuenta las generaciones de un tipo hechas por el usuario desde una fecha.
   */
  countSince(userId: string, kind: GenerationKind, since: Date): Promise<number>

  /**
   * Registra una generación completada.
   */
  record(userId: string, kind: GenerationKind): Promise<void>
}
