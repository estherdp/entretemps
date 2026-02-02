// src/ui/hooks/use-regenerate-mission.ts

'use client'

import { useState } from 'react'
import type { GeneratedAdventurePackMission } from '@/domain/generated-adventure-pack'

interface RegenerateMissionResult {
  regenerateMission: (packId: string, missionOrder: number, feedback?: string) => Promise<GeneratedAdventurePackMission | null>
  isRegenerating: boolean
  error: string | null
}

/**
 * Hook para regenerar una misión individual.
 *
 * Facilita la interacción con el endpoint /api/pack/[id]/regenerate-mission
 * desde componentes React.
 *
 * @returns Objeto con función regenerateMission, estado de carga y error
 */
export function useRegenerateMission(): RegenerateMissionResult {
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const regenerateMission = async (
    packId: string,
    missionOrder: number,
    feedback?: string
  ): Promise<GeneratedAdventurePackMission | null> => {
    setIsRegenerating(true)
    setError(null)

    try {
      const response = await fetch(`/api/pack/${packId}/regenerate-mission`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          missionOrder,
          feedback,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Error al regenerar misión')
      }

      return data.mission
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      console.error('[useRegenerateMission] Error:', err)
      return null
    } finally {
      setIsRegenerating(false)
    }
  }

  return { regenerateMission, isRegenerating, error }
}
