/**
 * Hook personalizado para obtener detalles de un pack del usuario
 * Encapsula el caso de uso getUserPackDetails
 */

import { useState, useEffect } from 'react'
import { getUserPackDetails } from '@/application/get-user-pack-details'
import { useRepositories } from '@/ui/providers/repository-provider'
import type { SavedAdventurePack } from '@/domain/saved-adventure-pack'

export function useUserPackDetails(packId: string) {
  const { authService, adventurePackRepository } = useRepositories()
  const [pack, setPack] = useState<SavedAdventurePack | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [needsAuth, setNeedsAuth] = useState(false)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      setError(null)
      setNeedsAuth(false)

      const result = await getUserPackDetails(
        packId,
        authService,
        adventurePackRepository
      )

      setPack(result.pack)
      setError(result.error || null)
      setNeedsAuth(result.needsAuth || false)
      setIsLoading(false)
    }

    load()
  }, [packId, authService, adventurePackRepository])

  return { pack, isLoading, error, needsAuth }
}
