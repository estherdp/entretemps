// src/infrastructure/ai/adapters/nanobanana.adapter.ts

import { GoogleGenAI } from '@google/genai'
import type { IImageGenerator } from '@/domain/services'
import type { GeneratedAdventurePackImage } from '@/domain/generated-adventure-pack'

/**
 * Adaptador para generación de imágenes con Google Gemini (Nanobanana/Imagen).
 *
 * Implementa IImageGenerator usando el SDK oficial @google/genai con modelos
 * de generación de imágenes de Gemini (ej: gemini-2.5-flash-image).
 *
 * Server-only: requiere GEMINI_API_KEY en process.env.
 *
 * Variables de entorno configurables:
 * - GEMINI_API_KEY (requerida): API key de Google AI Studio
 * - NANOBANANA_MODEL (opcional): Modelo de generación de imágenes (default: gemini-2.5-flash-image)
 *
 * Patrón Adapter: Adapta la API de Gemini a la interfaz IImageGenerator.
 */
export class NanobananaAdapter implements IImageGenerator {
  private readonly genAI: GoogleGenAI
  private readonly modelName: string

  constructor(apiKey?: string, modelName?: string) {
    const key = apiKey || process.env.GEMINI_API_KEY

    if (!key) {
      throw new Error('GEMINI_API_KEY no configurada. Configura la variable de entorno.')
    }

    this.genAI = new GoogleGenAI({ apiKey: key })
    this.modelName = modelName || process.env.NANOBANANA_MODEL || 'gemini-2.5-flash-image'
  }

  async generateImage(prompt: string): Promise<GeneratedAdventurePackImage> {
    try {
      console.log(`[NanobananaAdapter] Generando imagen con modelo: ${this.modelName}`)
      console.log(`[NanobananaAdapter] Prompt: ${prompt}`)

      // Generar imagen usando Gemini 2.5 Flash Image (Nano Banana)
      // Según documentación oficial: https://ai.google.dev/gemini-api/docs/image-generation
      const response = await this.genAI.models.generateContent({
        model: this.modelName,
        contents: this.buildImagePrompt(prompt),
      })

      console.log('[NanobananaAdapter] Respuesta recibida de Gemini')

      // Extraer la imagen generada de la respuesta
      const imageUrl = await this.extractImageUrl(response)

      console.log(`[NanobananaAdapter] Imagen generada exitosamente`)

      return {
        url: imageUrl,
        prompt,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      console.error(`[NanobananaAdapter] Error al generar imagen:`, error)
      throw new Error(`Error al generar imagen con Gemini: ${errorMessage}`)
    }
  }

  /**
   * Construye el prompt optimizado para generación de imágenes.
   * Añade instrucciones específicas para mejorar la calidad visual.
   */
  private buildImagePrompt(userPrompt: string): string {
    return `Generate a vibrant, child-friendly illustration for: ${userPrompt}

Style requirements:
- Colorful and engaging for children aged 4-12
- Safe, positive, and educational content
- Clear, simple composition
- Bright lighting and cheerful atmosphere
- High quality, detailed illustration

Do not include text or words in the image.`
  }

  /**
   * Extrae la URL de la imagen generada de la respuesta de Gemini.
   * Gemini 2.5 Flash Image devuelve la imagen como base64 en inlineData.
   * Documentación: https://ai.google.dev/gemini-api/docs/image-generation
   */
  private async extractImageUrl(response: any): Promise<string> {
    console.log('[NanobananaAdapter] Extrayendo imagen de la respuesta')

    // Verificar estructura básica de la respuesta
    if (!response) {
      console.error('[NanobananaAdapter] Respuesta vacía o undefined')
      throw new Error('Respuesta vacía de Gemini')
    }

    if (!response.candidates || response.candidates.length === 0) {
      console.error('[NanobananaAdapter] No hay candidates en la respuesta:', JSON.stringify(response, null, 2))
      throw new Error('No se recibieron candidates en la respuesta de Gemini')
    }

    const candidate = response.candidates[0]

    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      console.error('[NanobananaAdapter] No hay parts en el candidate:', JSON.stringify(candidate, null, 2))
      throw new Error('No se recibieron parts en la respuesta de Gemini')
    }

    const parts = candidate.content.parts
    console.log(`[NanobananaAdapter] Procesando ${parts.length} parts`)

    // Buscar parte con datos de imagen
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      console.log(`[NanobananaAdapter] Part ${i}:`, Object.keys(part))

      // Caso 1: Imagen inline como base64 (formato principal de Gemini 2.5 Flash Image)
      if (part.inlineData?.data && part.inlineData?.mimeType) {
        console.log(`[NanobananaAdapter] Imagen encontrada en inlineData (${part.inlineData.mimeType})`)
        const base64Data = part.inlineData.data
        const mimeType = part.inlineData.mimeType
        return `data:${mimeType};base64,${base64Data}`
      }

      // Caso 2: URL de imagen (fileData)
      if (part.fileData?.fileUri) {
        console.log(`[NanobananaAdapter] URL encontrada en fileData: ${part.fileData.fileUri}`)
        return part.fileData.fileUri
      }

      // Caso 3: Texto con URL (fallback)
      if (part.text) {
        console.log(`[NanobananaAdapter] Texto encontrado: ${part.text.substring(0, 100)}...`)
        if (part.text.startsWith('http://') || part.text.startsWith('https://')) {
          console.log('[NanobananaAdapter] URL encontrada en text')
          return part.text
        }
      }
    }

    console.error('[NanobananaAdapter] No se encontró imagen en ningún part')
    console.error('[NanobananaAdapter] Estructura completa:', JSON.stringify(response, null, 2))
    throw new Error('No se pudo extraer la imagen de la respuesta de Gemini')
  }
}
