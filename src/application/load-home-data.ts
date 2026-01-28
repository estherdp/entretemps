/**
 * Caso de uso: Cargar datos de la página principal
 * Obtiene plantillas y aventuras del usuario (si está autenticado)
 */

import { listTemplates, type TemplateListItem } from './list-templates'
import { listMyAdventurePacks } from './list-my-adventure-packs'
import type { AuthService } from '@/infrastructure/services/auth-service'
import type { AdventurePackRepository } from '@/infrastructure/supabase/adventure-pack-repository'
import type { SavedAdventurePack } from '@/domain/saved-adventure-pack'

export interface HomeData {
  templates: TemplateListItem[]
  myAdventures: SavedAdventurePack[]
  hasUser: boolean
}

export async function loadHomeData(
  authService: AuthService,
  repository: AdventurePackRepository,
  maxAdventures = 6
): Promise<HomeData> {
  // Cargar plantillas (siempre disponibles)
  const templates = listTemplates()

  // Cargar aventuras del usuario si está autenticado
  let myAdventures: SavedAdventurePack[] = []
  let hasUser = false

  try {
    const user = await authService.getCurrentUser()
    if (user) {
      hasUser = true
      const allAdventures = await listMyAdventurePacks(user.id, repository)
      // Limitar al número máximo solicitado
      myAdventures = allAdventures.slice(0, maxAdventures)
    }
  } catch (error) {
    console.error('Error al cargar aventuras del usuario:', error)
    // No lanzamos error, simplemente no mostramos las aventuras
  }

  return {
    templates,
    myAdventures,
    hasUser
  }
}
