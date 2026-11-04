'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { AdventurePackRepository } from '@/infrastructure/supabase/adventure-pack-repository'
import { createAuthService, type AuthService } from '@/infrastructure/services/auth-service'
import { SupabaseAccountService } from '@/infrastructure/supabase/account-service'
import { JsonTemplateRepository } from '@/infrastructure/templates/json-template-repository'
import type { IAccountService } from '@/domain/services'
import type { ITemplateRepository } from '@/domain/repositories'

/**
 * Contexto de inyección de dependencias
 * Proporciona acceso a los repositorios y servicios de infraestructura
 * sin que los componentes UI conozcan los detalles de implementación
 */

interface RepositoryContextValue {
  adventurePackRepository: AdventurePackRepository
  authService: AuthService
  accountService: IAccountService
  templateRepository: ITemplateRepository
}

const RepositoryContext = createContext<RepositoryContextValue | null>(null)

interface RepositoryProviderProps {
  children: ReactNode
}

export function RepositoryProvider({ children }: RepositoryProviderProps) {
  // Memoizamos las instancias para evitar recrearlas en cada render
  const contextValue = useMemo<RepositoryContextValue>(() => ({
    adventurePackRepository: new AdventurePackRepository(),
    authService: createAuthService(),
    accountService: new SupabaseAccountService(),
    templateRepository: new JsonTemplateRepository(),
  }), [])

  return (
    <RepositoryContext.Provider value={contextValue}>
      {children}
    </RepositoryContext.Provider>
  )
}

/**
 * Hook para acceder a los repositorios desde componentes
 * Lanza error si se usa fuera del RepositoryProvider
 */
export function useRepositories() {
  const context = useContext(RepositoryContext)
  
  if (!context) {
    throw new Error('useRepositories must be used within RepositoryProvider')
  }
  
  return context
}
