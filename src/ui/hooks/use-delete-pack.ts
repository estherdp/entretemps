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
      console.log('[useDeletePack] Iniciando eliminación del pack:', packId)

      const user = await authService.getCurrentUser()
      console.log('[useDeletePack] Usuario obtenido:', user?.id)

      if (!user) {
        const errorMsg = 'Debes iniciar sesión para eliminar aventuras'
        console.error('[useDeletePack]', errorMsg)
        setError(errorMsg)
        return false
      }

      console.log('[useDeletePack] Llamando a deleteMyAdventurePack...')
      const result = await deleteMyAdventurePack(
        { packId, userId: user.id },
        adventurePackRepository
      )

      console.log('[useDeletePack] Resultado:', result)

      if (!result.ok) {
        const errorMsg = result.error || 'Error al eliminar la aventura'
        console.error('[useDeletePack] Error del caso de uso:', errorMsg)
        setError(errorMsg)
        return false
      }

      console.log('[useDeletePack] Eliminación exitosa')
      return true
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Error desconocido'
      console.error('[useDeletePack] Excepción capturada:', err)
      setError(errorMsg)
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  return { deletePack, isDeleting, error }
}
