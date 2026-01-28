/**
 * Hook personalizado para cargar datos de la home
 * Encapsula el caso de uso loadHomeData
 */

import { useState, useEffect } from 'react'
import { loadHomeData, type HomeData } from '@/application/load-home-data'
import { useRepositories } from '@/ui/providers/repository-provider'

export function useHomeData(maxAdventures = 6) {
  const { authService, adventurePackRepository } = useRepositories()
  const [data, setData] = useState<HomeData>({
    templates: [],
    myAdventures: [],
    hasUser: false
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        const homeData = await loadHomeData(
          authService,
          adventurePackRepository,
          maxAdventures
        )
        setData(homeData)
      } catch (error) {
        console.error('Error al cargar datos de la home:', error)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [authService, adventurePackRepository, maxAdventures])

  return { data, isLoading }
}
