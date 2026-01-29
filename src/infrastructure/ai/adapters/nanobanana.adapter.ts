// src/infrastructure/ai/adapters/nanobanana.adapter.ts

import type { IImageGenerator } from '@/domain/services'
import type { GeneratedAdventurePackImage } from '@/domain/generated-adventure-pack'

/**
 * Adaptador MOCK para Nanobanana (generación de imágenes).
 *
 * Implementa IImageGenerator devolviendo URLs de Unsplash como placeholder
 * para probar la arquitectura sin necesidad de configurar API Keys.
 *
 * Nota: Por ahora los proveedores de aventura (n8n, OpenAI, Gemini)
 * devuelven la imagen incluida. Este adaptador estará listo para cuando
 * se separe la generación de texto de la generación de imagen.
 *
 * TODO: Implementar la llamada real a Nanobanana API cuando se configure.
 */
export class NanobananaAdapter implements IImageGenerator {
  private readonly mockImages = [
    'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', // Selva 1
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800', // Selva 2
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800', // Selva 3
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800', // Naturaleza 1
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', // Naturaleza 2
  ]

  async generateImage(prompt: string): Promise<GeneratedAdventurePackImage> {
    // Simulamos latencia de generación de imagen
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Seleccionamos una imagen basada en el hash del prompt (para consistencia)
    const index = this.hashPrompt(prompt) % this.mockImages.length
    const url = this.mockImages[index]

    return {
      url,
      prompt,
    }
  }

  /**
   * Genera un hash simple del prompt para seleccionar consistentemente
   * la misma imagen para el mismo prompt.
   */
  private hashPrompt(prompt: string): number {
    let hash = 0
    for (let i = 0; i < prompt.length; i++) {
      const char = prompt.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }
}
