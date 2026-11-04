// src/application/adventure-constraints.ts

import type { WizardData } from '@/domain/wizard-data'

export interface AdventureGenerationConstraints {
  phases: number
  puzzlesPerPhase: number
  screenFree: boolean
}

const MISSIONS_BY_DIFFICULTY: Record<NonNullable<WizardData['difficulty']>, number> = {
  easy: 3,
  medium: 4,
  hard: 5,
}

/**
 * Regla de negocio: la dificultad determina cuántas misiones tiene la aventura.
 * Las aventuras siempre son sin pantallas.
 */
export function buildAdventureConstraints(wizardData: WizardData): AdventureGenerationConstraints {
  return {
    phases: wizardData.difficulty ? MISSIONS_BY_DIFFICULTY[wizardData.difficulty] : 3,
    puzzlesPerPhase: 2,
    screenFree: true,
  }
}
