/**
 * Hook personalizado para guardar una aventura generada
 * Encapsula el caso de uso saveAdventurePack
 */

import { useState } from 'react'
import { saveAdventurePack } from '@/application/save-adventure-pack'
import { useRepositories } from '@/ui/providers/repository-provider'
import type { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'

export function useSaveAdventurePack() {
  const { authService, adventurePackRepository } = useRepositories()
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const save = async (pack: GeneratedAdventurePack): Promise<boolean> => {
    setIsSaving(true)
    setError(null)

    try {
      const user = await authService.getCurrentUser()
      if (!user) {
        setError('Necesitas iniciar sesión')
        return false
      }

      await saveAdventurePack(
        { userId: user.id, pack },
        adventurePackRepository
      )
      setSaved(true)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar')
      return false
    } finally {
      setIsSaving(false)
    }
  }

  return { save, isSaving, saved, error }
}
