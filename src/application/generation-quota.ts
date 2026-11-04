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

/**
 * Lee un límite numérico de configuración con un valor por defecto seguro.
 */
export function parseQuotaLimit(raw: string | undefined, fallback: number): number {
  const parsed = raw ? parseInt(raw, 10) : NaN
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
}
