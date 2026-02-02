// src/domain/services/mission-editor.interface.ts

import type { GeneratedAdventurePackMission } from '@/domain/generated-adventure-pack'

/**
 * Contexto de la aventura necesario para regenerar una misión coherente.
 *
 * Provee información sobre la aventura completa para que la IA
 * genere misiones consistentes con el resto del pack.
 */
export interface AdventureContext {
  title: string
  ageRange: { min: number; max: number }
  adventureType: 'mystery' | 'adventure' | 'fantasy' | 'action' | 'humor'
  tone: 'funny' | 'enigmatic' | 'exciting' | 'calm'
  place: 'home' | 'garden' | 'park' | 'indoor' | 'outdoor'
  difficulty: 'easy' | 'medium' | 'hard'
  existingMissions?: Array<{
    order: number
    title: string
    story: string
  }>
}

/**
 * Puerto (Interface) para proveedores de edición de misiones.
 *
 * Define el contrato para regenerar misiones individuales de forma coherente
 * con el contexto de la aventura completa.
 *
 * Clean Architecture: Esta interfaz pertenece a la capa de dominio
 * y NO debe tener dependencias de librerías externas o frameworks.
 *
 * Patrón Adapter: Los adaptadores concretos (Gemini, OpenAI, etc.)
 * implementarán esta interfaz, permitiendo intercambiar proveedores
 * sin modificar la lógica de negocio.
 */
export interface IMissionEditor {
  /**
   * Regenera una misión individual basándose en el contexto de la aventura.
   *
   * @param context - Contexto de la aventura completa
   * @param currentMission - Misión actual que se quiere regenerar
   * @param feedback - Feedback opcional del usuario sobre qué mejorar
   * @param locale - Idioma de generación ('es', 'en', etc.)
   * @returns Promise con la nueva misión regenerada
   * @throws Error si la regeneración falla
   */
  regenerateSingleMission(
    context: AdventureContext,
    currentMission: GeneratedAdventurePackMission,
    feedback: string | undefined,
    locale: string
  ): Promise<GeneratedAdventurePackMission>
}
