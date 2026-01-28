/**
 * Caso de uso: Guardar plantilla como pack propio del usuario
 * Valida autenticación y guarda una plantilla como pack del usuario
 */

import type { AuthService } from '@/infrastructure/services/auth-service'
import type { AdventurePackRepository } from '@/infrastructure/supabase/adventure-pack-repository'
import type { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'
import type { SavedAdventurePack } from '@/domain/saved-adventure-pack'
import { saveTemplateAsMyPack as saveTemplate } from './save-template-as-my-pack'

export interface SaveTemplateResult {
  savedPack: SavedAdventurePack | null
  needsAuth?: boolean
  error?: string
}

export async function saveTemplateAsUserPack(
  pack: GeneratedAdventurePack,
  authService: AuthService,
  repository: AdventurePackRepository
): Promise<SaveTemplateResult> {
  try {
    // Verificar autenticación
    const user = await authService.getCurrentUser()
    if (!user) {
      return { savedPack: null, needsAuth: true }
    }

    // Guardar el pack
    const savedPack = await saveTemplate(user.id, pack, repository)

    return { savedPack }
  } catch (error) {
    return {
      savedPack: null,
      error: error instanceof Error ? error.message : 'Error al guardar la plantilla'
    }
  }
}
