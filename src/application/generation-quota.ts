// src/application/generation-quota.ts

import type { GenerationKind, IGenerationUsageRepository } from '@/domain/repositories'
import { UserQuotaExceededError } from '@/domain/errors'

const WINDOW_MS = 24 * 60 * 60 * 1000

export interface GenerationQuotaStatus {
  used: number
  limit: number
  remaining: number
}

/**
 * Caso de Uso: Comprobar la cuota de generaciones de un usuario.
 *
 * Ventana deslizante de 24 horas. Protege la cuota del proveedor de IA
 * (p. ej. el tier gratuito de Gemini, que es por proyecto) frente a que
 * un solo usuario la agote.
 *
 * @throws UserQuotaExceededError si el usuario ya ha llegado al límite
 */
export async function assertGenerationQuota(
  userId: string,
  kind: GenerationKind,
  limit: number,
  repository: IGenerationUsageRepository,
  now: Date = new Date()
): Promise<GenerationQuotaStatus> {
  const since = new Date(now.getTime() - WINDOW_MS)
  const used = await repository.countSince(userId, kind, since)

  if (used >= limit) {
    throw new UserQuotaExceededError(limit)
  }

  return { used, limit, remaining: limit - used }
}

export type GenerationUsageSummary = Record<GenerationKind, GenerationQuotaStatus>

/**
 * Caso de Uso: Consultar cuánto ha usado el usuario de cada tipo de generación
 * en las últimas 24 horas (para mostrarlo en "Mi cuenta").
 */
export async function getGenerationUsage(
  userId: string,
  limits: Record<GenerationKind, number>,
  repository: IGenerationUsageRepository,
  now: Date = new Date()
): Promise<GenerationUsageSummary> {
  const since = new Date(now.getTime() - WINDOW_MS)
  const kinds = Object.keys(limits) as GenerationKind[]

  const entries = await Promise.all(
    kinds.map(async (kind) => {
      const used = await repository.countSince(userId, kind, since)
      const limit = limits[kind]
      return [kind, { used, limit, remaining: Math.max(limit - used, 0) }] as const
    })
  )

  return Object.fromEntries(entries) as GenerationUsageSummary
}

/**
 * Lee un límite numérico de configuración con un valor por defecto seguro.
 */
export function parseQuotaLimit(raw: string | undefined, fallback: number): number {
  const parsed = raw ? parseInt(raw, 10) : NaN
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
}
