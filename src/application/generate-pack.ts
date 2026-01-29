// src/application/generate-pack.ts

import type { WizardData } from '@/domain/wizard-data'
import type { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'
import type { IAdventureProvider } from '@/domain/services'

interface GeneratePackResult {
  ok: boolean
  error?: string
  pack?: GeneratedAdventurePack
}

/**
 * Caso de Uso: Generar un pack de aventura completo.
 *
 * Implementa el patrón de Inyección de Dependencias para desacoplar
 * la lógica de negocio de las implementaciones concretas de IA.
 *
 * INVERSIÓN DE DEPENDENCIA (Dependency Inversion Principle):
 * - Este caso de uso (capa de aplicación) NO depende de infrastructure
 * - Depende de la abstracción IAdventureProvider (capa de dominio)
 * - Los adaptadores concretos (N8N, OpenAI, Gemini) implementan la interfaz
 *
 * @param wizardData - Datos recopilados del wizard
 * @param provider - Proveedor de IA (N8N, OpenAI, Gemini, etc.)
 * @returns Resultado con el pack generado o error
 */
export async function generatePack(
  wizardData: WizardData,
  provider: IAdventureProvider
): Promise<GeneratePackResult> {
  try {
    const pack = await provider.generateAdventure(wizardData, 'es', {
      phases: 3,
      puzzlesPerPhase: 2,
      screenFree: true,
    })

    return { ok: true, pack }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    return { ok: false, error: errorMessage }
  }
}
