import { useState } from 'react'
import { deleteMyAdventurePack } from '@/application/delete-my-adventure-pack'
import { useRepositories } from '@/ui/providers/repository-provider'

export function useDeletePack() {
  const { authService, adventurePackRepository } = useRepositories()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const deletePack = async (packId: string): Promise<boolean> => {
    setIsDeleting(true)
    setError(null)

    try {
      const user = await authService.getCurrentUser()

      if (!user) {
        const errorMsg = 'Debes iniciar sesión para eliminar aventuras'
        setError(errorMsg)
        return false
      }

      const result = await deleteMyAdventurePack(
        { packId, userId: user.id },
        adventurePackRepository
      )

      if (!result.ok) {
        const errorMsg = result.error || 'Error al eliminar la aventura'
        setError(errorMsg)
        return false
      }

      return true
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido'
      console.error('[useDeletePack] Error:', err)
      setError(errorMsg)
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  return { deletePack, isDeleting, error }
}
