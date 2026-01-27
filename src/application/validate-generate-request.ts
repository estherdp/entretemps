// src/application/validate-generate-request.ts

import type { WizardData } from '@/domain/wizard-data'

interface ValidateResult {
  ok: boolean
  error?: string
}

export async function validateGenerateRequest(wizardData: WizardData): Promise<ValidateResult> {
  try {
    const response = await fetch('/api/pack/mock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        locale: 'es',
        wizardData,
        constraints: {
          phases: 3,
          puzzlesPerPhase: 2,
          screenFree: true,
        },
      }),
    })

    if (response.status === 204) {
      return { ok: true }
    }

    return { ok: false, error: 'Error al validar la petición.' }
  } catch {
    return { ok: false, error: 'Error de conexión.' }
  }
}
