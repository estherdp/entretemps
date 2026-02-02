// src/ui/hooks/use-reorder-missions.ts

'use client'

import { useState } from 'react'
import type { GeneratedAdventurePackMission } from '@/domain/generated-adventure-pack'

interface ReorderMissionsResult {
  reorderMissions: (packId: string, newOrder: number[]) => Promise<GeneratedAdventurePackMission[] | null>
  isReordering: boolean
  error: string | null
}

/**
 * Hook para reordenar misiones de un pack.
 *
 * Facilita la interacción con el endpoint /api/pack/[id]/reorder-missions
 * desde componentes React.
 *
 * @returns Objeto con función reorderMissions, estado de carga y error
 */
export function useReorderMissions(): ReorderMissionsResult {
  const [isReordering, setIsReordering] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const reorderMissions = async (
    packId: string,
    newOrder: number[]
  ): Promise<GeneratedAdventurePackMission[] | null> => {
    setIsReordering(true)
    setError(null)

    try {
      const response = await fetch(`/api/pack/${packId}/reorder-missions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newOrder,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Error al reordenar misiones')
      }

      return data.missions
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('[useReorderMissions] Error:', err)
      return null
    } finally {
      setIsReordering(false)
    }
  }

  return { reorderMissions, isReordering, error }
}
