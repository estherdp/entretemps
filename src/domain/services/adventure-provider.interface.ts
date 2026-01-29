// src/domain/services/adventure-provider.interface.ts

import type { WizardData } from '@/domain/wizard-data'
import type { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'

/**
 * Puerto (Interface) para proveedores de generación de aventuras.
 *
 * Define el contrato que deben cumplir TODOS los proveedores de IA
 * (n8n, OpenAI, Gemini, etc.) para generar aventuras completas.
 *
 * Clean Architecture: Esta interfaz pertenece a la capa de dominio
 * y NO debe tener dependencias de librerías externas o frameworks.
 *
 * Patrón Adapter: Los adaptadores concretos (n8n, OpenAI, Gemini)
 * implementarán esta interfaz, permitiendo intercambiar proveedores
 * sin modificar la lógica de negocio.
 */
export interface IAdventureProvider {
  /**
   * Genera una aventura completa basada en los datos del wizard.
   *
   * @param wizardData - Datos del wizard (ocasión, edades, intereses, etc.)
   * @param locale - Idioma de generación ('es', 'en', etc.)
   * @param constraints - Restricciones de la aventura (fases, puzzles, etc.)
   * @returns Promise con el pack de aventura generado
   * @throws Error si la generación falla
   */
  generateAdventure(
    wizardData: WizardData,
    locale: string,
    constraints: {
      phases: number
      puzzlesPerPhase: number
      screenFree: boolean
    }
  ): Promise<GeneratedAdventurePack>
}
