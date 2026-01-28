/**
 * Hook personalizado para listar todas las aventuras del usuario
 * Encapsula el caso de uso listMyAdventurePacks
 */

import { useState, useEffect } from 'react'
import { listMyAdventurePacks } from '@/application/list-my-adventure-packs'
import { useRepositories } from '@/ui/providers/repository-provider'
import type { SavedAdventurePack } from '@/domain/saved-adventure-pack'

export function useMyAdventurePacks() {
  const { authService, adventurePackRepository } = useRepositories()
  const [packs, setPacks] = useState<SavedAdventurePack[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [needsAuth, setNeedsAuth] = useState(false)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      setError(null)
      setNeedsAuth(false)

      try {
        const user = await authService.getCurrentUser()
        if (!user) {
          setNeedsAuth(true)
          setIsLoading(false)
          return
        }

        const userPacks = await listMyAdventurePacks(user.id, adventurePackRepository)
        setPacks(userPacks)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar aventuras')
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [authService, adventurePackRepository])

  return { packs, isLoading, error, needsAuth }
}
