/**
 * Caso de uso: Obtener detalles de un pack del usuario
 * Recupera un pack específico y valida que pertenece al usuario actual
 */

import type { IAuthService } from '@/domain/services'
import type { IAdventurePackRepository } from '@/domain/repositories'
import type { SavedAdventurePack } from '@/domain/saved-adventure-pack'

export interface GetUserPackDetailsResult {
  pack: SavedAdventurePack | null
  error?: string
  needsAuth?: boolean
}

export async function getUserPackDetails(
  packId: string,
  authService: IAuthService,
  repository: IAdventurePackRepository
): Promise<GetUserPackDetailsResult> {
  try {
    // Verificar autenticación
    const user = await authService.getCurrentUser()
    if (!user) {
      return { pack: null, needsAuth: true }
    }

    // Obtener el pack
    const pack = await repository.getById(packId)
    
    if (!pack) {
      return { pack: null, error: 'Pack no encontrado' }
    }

    // Verificar que el pack pertenece al usuario
    if (pack.userId !== user.id) {
      return { pack: null, error: 'No tienes acceso a este pack' }
    }

    return { pack }
  } catch (error) {
    return {
      pack: null,
      error: error instanceof Error ? error.message : 'Error al cargar el pack'
    }
  }
}
