// src/application/dto/generate-pack-request.ts

import type { WizardData } from '@/domain/wizard-data'

export interface GeneratePackConstraints {
  phases: number
  puzzlesPerPhase: number
  screenFree: boolean
}

export interface GeneratePackRequest {
  locale: string
  wizardData: WizardData
  constraints: GeneratePackConstraints
}
