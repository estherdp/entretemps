// src/infrastructure/n8n/n8n-adapter.ts

import type { IAdventureProvider } from '@/domain/services'
import type { WizardData } from '@/domain/wizard-data'
import type { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'

/**
 * Adaptador para N8N - Implementa IAdventureProvider.
 *
 * Este adaptador mantiene la integración con el flujo externo de N8N
 * existente, pero ahora cumple con el contrato definido en la capa
 * de dominio, permitiendo intercambiar este proveedor por otros
 * (OpenAI, Gemini, etc.) sin modificar la lógica de negocio.
 *
 * Patrón Adapter: Adapta la API de N8N a la interfaz IAdventureProvider.
 */
export class N8NAdapter implements IAdventureProvider {
  private readonly webhookUrl: string

  constructor(webhookUrl?: string) {
    const url = webhookUrl || process.env.N8N_WEBHOOK_URL

    if (!url) {
      throw new Error('N8N_WEBHOOK_URL no configurada.')
    }

    this.webhookUrl = url
  }

  async generateAdventure(
    wizardData: WizardData,
    locale: string,
    constraints: { phases: number; puzzlesPerPhase: number; screenFree: boolean }
  ): Promise<GeneratedAdventurePack> {
    const request = {
      locale,
      wizardData,
      constraints,
    }

    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`Error del servidor N8N: ${response.status}`)
      }

      const pack: GeneratedAdventurePack = await response.json()
      return pack
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      throw new Error(`Error de conexión con N8N: ${errorMessage}`)
    }
  }
}

