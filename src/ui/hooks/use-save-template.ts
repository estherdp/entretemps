/**
 * Hook personalizado para guardar una plantilla como pack del usuario
 * Encapsula el caso de uso saveTemplateAsUserPack
 */

import { useState } from 'react'
import { saveTemplateAsUserPack } from '@/application/save-template-as-user-pack'
import { useRepositories } from '@/ui/providers/repository-provider'
import type { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'
import type { SavedAdventurePack } from '@/domain/saved-adventure-pack'

export function useSaveTemplateAsMyPack() {
  const { authService, adventurePackRepository } = useRepositories()
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const saveTemplate = async (
    pack: GeneratedAdventurePack
  ): Promise<SavedAdventurePack | null> => {
    setIsSaving(true)
    setError(null)

    try {
      const result = await saveTemplateAsUserPack(
        pack,
        authService,
        adventurePackRepository
      )

      if (result.needsAuth) {
        setError('Necesitas iniciar sesión')
        return null
      }

      if (result.error) {
        setError(result.error)
        return null
      }

      return result.savedPack
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar'
      setError(errorMessage)
      return null
    } finally {
      setIsSaving(false)
    }
  }

  return { saveTemplate, isSaving, error }
}
