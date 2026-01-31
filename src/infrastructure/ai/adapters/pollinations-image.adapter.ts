// src/infrastructure/ai/adapters/pollinations-image.adapter.ts

import type { IImageGenerator } from '@/domain/services'
import type { GeneratedAdventurePackImage } from '@/domain/generated-adventure-pack'

/**
 * Configuración de parámetros para la generación de imágenes con Pollinations.
 */
interface PollinationsImageParams {
  width?: number
  height?: number
  seed?: number
  model?: string
  nologo?: boolean
  private?: boolean
  enhance?: boolean
}

/**
 * Adaptador para generación de imágenes usando Pollinations AI.
 *
 * Implementa IImageGenerator para generar imágenes mediante la API de Pollinations,
 * una alternativa de código abierto para generación de imágenes con IA.
 *
 * Características:
 * - Generación con modelo Flux por defecto
 * - Optimizado para ilustraciones infantiles de alta calidad
 * - Resolución 1024x1024 por defecto
 * - Seeds aleatorias para variedad
 * - Autenticación mediante API Key (modo auth)
 *
 * Variables de entorno:
 * - POLLINATIONS_API_KEY (requerida): API key de Pollinations
 *
 * Clean Architecture: Este adaptador pertenece a la capa de infraestructura
 * y adapta la API de Pollinations al contrato IImageGenerator del dominio.
 *
 * @see https://pollinations.ai/
 */
export class PollinationsImageAdapter implements IImageGenerator {
  private readonly apiKey: string
  private readonly baseUrl = 'https://gen.pollinations.ai'

  // Prompt wrapper para estilo de ilustraciones infantiles tipo cartoon/anime
  private readonly styleWrapper =
    'Cartoon illustration style, vibrant colors, cute animated characters, playful and whimsical art, digital painting, fantasy storybook aesthetic, cheerful atmosphere, smooth shading, no text, no realistic people, anime-inspired children\'s illustration'

  // Parámetros por defecto optimizados para ilustraciones infantiles
  private readonly defaultParams: PollinationsImageParams = {
    width: 1024,
    height: 1024,
    model: 'flux',
    nologo: true,
    private: false,
    enhance: true,
  }

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.POLLINATIONS_API_KEY || ''

    if (!this.apiKey) {
      throw new Error(
        'POLLINATIONS_API_KEY no configurada. Configura la variable de entorno.'
      )
    }
  }

  /**
   * Genera una imagen basada en el prompt proporcionado.
   *
   * Aplica automáticamente un estilo wrapper optimizado para ilustraciones
   * infantiles y configura parámetros para alta calidad visual.
   *
   * @param prompt - Descripción de la imagen a generar
   * @returns Promise con la imagen generada (URL y prompt)
   * @throws Error si la generación falla o la API retorna un error
   */
  async generateImage(prompt: string): Promise<GeneratedAdventurePackImage> {
    try {
      console.log('[PollinationsImageAdapter] Iniciando generación de imagen')
      console.log(`[PollinationsImageAdapter] Prompt original: ${prompt}`)

      // Aplicar style wrapper al prompt
      const enhancedPrompt = this.enhancePrompt(prompt)
      console.log(`[PollinationsImageAdapter] Prompt mejorado: ${enhancedPrompt}`)

      // Generar seed aleatorio para variedad en las imágenes
      const seed = this.generateRandomSeed()

      // Construir URL de la imagen con parámetros
      const imageUrl = this.buildImageUrl(enhancedPrompt, seed)

      console.log('[PollinationsImageAdapter] URL de imagen construida')
      console.log(`[PollinationsImageAdapter] Seed: ${seed}`)
      console.log(`[PollinationsImageAdapter] URL: ${imageUrl}`)

      // Pollinations genera imágenes bajo demanda al acceder a la URL
      // No se requiere verificación previa - la imagen se genera cuando se accede a la URL
      console.log('[PollinationsImageAdapter] Imagen generada exitosamente')

      return {
        url: imageUrl,
        prompt: enhancedPrompt,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      console.error('[PollinationsImageAdapter] Error al generar imagen:', error)
      throw new Error(`Error al generar imagen con Pollinations: ${errorMessage}`)
    }
  }

  /**
   * Aplica el style wrapper al prompt del usuario.
   * Combina el prompt original con las instrucciones de estilo para
   * asegurar ilustraciones de alta calidad apropiadas para niños.
   */
  private enhancePrompt(userPrompt: string): string {
    return `${userPrompt}. ${this.styleWrapper}`
  }

  /**
   * Genera un seed aleatorio para la generación de imágenes.
   * Esto asegura variedad en las imágenes generadas con el mismo prompt.
   */
  private generateRandomSeed(): number {
    return Math.floor(Math.random() * 1000000)
  }

  /**
   * Construye la URL de la imagen con todos los parámetros necesarios.
   *
   * La API de Pollinations genera imágenes bajo demanda mediante URLs GET.
   * Formato correcto según documentación oficial:
   * https://gen.pollinations.ai/image/{prompt}?model=flux&key=YOUR_KEY
   *
   * Autenticación: Se incluye la API key como query parameter.
   *
   * @param prompt - Prompt de la imagen (será URL-encoded)
   * @param seed - Seed para la generación
   * @returns URL completa de la imagen
   */
  private buildImageUrl(prompt: string, seed: number): string {
    // Codificar el prompt para URL
    const encodedPrompt = encodeURIComponent(prompt)

    // Construir query string con parámetros (incluye API key)
    const params = new URLSearchParams({
      model: this.defaultParams.model!,
      width: this.defaultParams.width!.toString(),
      height: this.defaultParams.height!.toString(),
      seed: seed.toString(),
      nologo: this.defaultParams.nologo!.toString(),
      private: this.defaultParams.private!.toString(),
      enhance: this.defaultParams.enhance!.toString(),
      key: this.apiKey, // API key como query parameter
    })

    return `${this.baseUrl}/image/${encodedPrompt}?${params.toString()}`
  }

}

/**
 * Factory para crear instancia del adapter con configuración por defecto.
 * Facilita la inyección de dependencias en los casos de uso.
 */
export function createPollinationsImageAdapter(): PollinationsImageAdapter {
  return new PollinationsImageAdapter()
}
