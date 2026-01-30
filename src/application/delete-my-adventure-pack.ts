// src/application/delete-my-adventure-pack.ts

import type { AdventurePackRepository } from '@/infrastructure/supabase/adventure-pack-repository'

export interface DeleteMyAdventurePackRequest {
  packId: string
  userId: string
}

export interface DeleteMyAdventurePackResult {
  ok: boolean
  error?: string
}

/**
 * Caso de Uso: Eliminar una aventura del usuario.
 *
 * SEGURIDAD:
 * - Solo permite eliminar aventuras que pertenecen al usuario autenticado
 * - Verifica ownership antes de eliminar
 * - NO permite eliminar plantillas (templates) del sistema
 *
 * VALIDACIONES:
 * - El pack debe existir
 * - El pack debe pertenecer al usuario (userId coincide)
 * - No se puede eliminar si no se cumplen las condiciones anteriores
 *
 * @param request - ID del pack y userId del usuario autenticado
 * @param repository - Repositorio de packs
 * @returns Resultado con ok: true si se eliminó correctamente
 */
export async function deleteMyAdventurePack(
  request: DeleteMyAdventurePackRequest,
  repository: AdventurePackRepository
): Promise<DeleteMyAdventurePackResult> {
  try {
    const { packId, userId } = request

    // Validaciones básicas
    if (!packId || packId.trim() === '') {
      return {
        ok: false,
        error: 'El ID del pack es requerido',
      }
    }

    if (!userId || userId.trim() === '') {
      return {
        ok: false,
        error: 'El ID del usuario es requerido',
      }
    }

    // Intentar eliminar (el repositorio valida ownership)
    await repository.deleteById(packId, userId)

    return {
      ok: true,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'

    // Retornar error amigable
    return {
      ok: false,
      error: errorMessage,
    }
  }
}
