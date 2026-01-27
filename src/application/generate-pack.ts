// src/application/generate-pack.ts

import type { WizardData } from '@/domain/wizard-data'
import type { GeneratePackRequest } from '@/application/dto/generate-pack-request'
import type { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'
import { sendToN8N } from '@/infrastructure/n8n/n8n-adapter'

interface GeneratePackResult {
  ok: boolean
  error?: string
  pack?: GeneratedAdventurePack
}

export async function generatePack(wizardData: WizardData): Promise<GeneratePackResult> {
  const request: GeneratePackRequest = {
    locale: 'es',
    wizardData,
    constraints: {
      phases: 3,
      puzzlesPerPhase: 2,
      screenFree: true,
    },
  }

  return await sendToN8N(request)
}
