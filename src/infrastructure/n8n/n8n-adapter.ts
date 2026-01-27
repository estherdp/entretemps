// src/infrastructure/n8n/n8n-adapter.ts

import type { GeneratePackRequest } from '@/application/dto/generate-pack-request'
import type { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'

export async function sendToN8N(
  request: GeneratePackRequest
): Promise<{ ok: boolean; error?: string; pack?: GeneratedAdventurePack }> {
  const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL

  if (!webhookUrl) {
    return { ok: false, error: 'N8N_WEBHOOK_URL no configurada.' }
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    })

    if (response.ok) {
      const pack: GeneratedAdventurePack = await response.json()
      return { ok: true, pack }
    }

    return { ok: false, error: `Error del servidor: ${response.status}` }
  } catch (error) {
    return { ok: false, error: 'Error de conexión con n8n.' }
  }
}
