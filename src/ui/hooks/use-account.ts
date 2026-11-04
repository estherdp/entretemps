'use client'

import { useCallback, useEffect, useState } from 'react'
import { deleteMyAccount, updateDisplayName } from '@/application/manage-account'
import type { GenerationUsageSummary } from '@/application/generation-quota'
import { useRepositories } from '@/ui/providers/repository-provider'

/**
 * Uso de IA del usuario en las últimas 24 horas.
 */
type UsageResult = { usage: GenerationUsageSummary; error: null } | { usage: null; error: string }

async function fetchGenerationUsage(): Promise<UsageResult> {
  try {
    const response = await fetch('/api/me/usage', { cache: 'no-store' })
    const result: { ok: boolean; usage?: GenerationUsageSummary; error?: string } = await response.json()
    return result.ok && result.usage
      ? { usage: result.usage, error: null }
      : { usage: null, error: result.error ?? 'No se pudo consultar el uso' }
  } catch {
    return { usage: null, error: 'No se pudo consultar el uso' }
  }
}

export function useGenerationUsage() {
  const [usage, setUsage] = useState<GenerationUsageSummary | null>(null)
  const [error, setError] = useState<string | null>(null)

  const apply = useCallback((result: UsageResult) => {
    setUsage(result.usage)
    setError(result.error)
  }, [])

  const refresh = useCallback(() => fetchGenerationUsage().then(apply), [apply])

  useEffect(() => {
    let cancelled = false
    fetchGenerationUsage().then((result) => {
      if (!cancelled) apply(result)
    })
    return () => {
      cancelled = true
    }
  }, [apply])

  return { usage, error, refresh }
}

/**
 * Acciones de "Mi cuenta": cambiar el nombre y borrar la cuenta.
 */
export function useAccountActions() {
  const { accountService } = useRepositories()
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const saveDisplayName = async (name: string): Promise<boolean> => {
    setIsSaving(true)
    setError(null)
    try {
      await updateDisplayName(name, accountService)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el nombre')
      return false
    } finally {
      setIsSaving(false)
    }
  }

  const deleteAccount = async (confirmation: string): Promise<boolean> => {
    setIsDeleting(true)
    setError(null)
    try {
      await deleteMyAccount(confirmation, accountService)
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al borrar la cuenta')
      return false
    } finally {
      setIsDeleting(false)
    }
  }

  return { saveDisplayName, deleteAccount, isSaving, isDeleting, error }
}
