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
 * - Autenticación mediante API Key (parámetro 'key')
 *
 * Variables de entorno:
 * - POLLINATIONS_API_KEY (requerida): API key de Pollinations
 *
 * API Format:
 * - Base URL: https://gen.pollinations.ai/image/{prompt}
 * - Auth parameter: key={API_KEY}
 * - Ejemplo: https://gen.pollinations.ai/image/prompt?width=1024&height=1024&key=API_KEY
 *
 * Clean Architecture: Este adaptador pertenece a la capa de infraestructura
 * y adapta la API de Pollinations al contrato IImageGenerator del dominio.
 *
 * @see https://pollinations.ai/
 */
export class PollinationsImageAdapter implements IImageGenerator {
  private readonly apiKey: string
  private readonly baseUrl = 'https://gen.pollinations.ai/image'

  // Prompt wrapper para estilo de ilustraciones infantiles tipo cartoon/anime
  // Versión corta para evitar URLs demasiado largas
  private readonly styleWrapper =
    'Cartoon style, vibrant colors, cute characters, cheerful, no text'

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

    // Log para verificar versión en Vercel
    console.log('[PollinationsImageAdapter] ✅ VERSIÓN CORREGIDA - Inicializado correctamente')
    console.log('[PollinationsImageAdapter] Base URL:', this.baseUrl)
    console.log('[PollinationsImageAdapter] Formato auth: key=API_KEY')
  }

  /**
   * Genera una URL de imagen de Pollinations que se renderiza on-demand.
   *
   * IMPORTANTE: No hace fetch del servidor. Devuelve la URL directamente para que
   * el navegador del cliente haga la petición GET y obtenga la imagen.
   *
   * Esto evita bloquear las Serverless Functions de Vercel esperando la generación.
   * El navegador se encarga de cargar la imagen cuando el usuario accede a la URL.
   *
   * @param prompt - Descripción de la imagen a generar
   * @returns Promise con la URL de generación y prompt mejorado
   */
  async generateImage(prompt: string): Promise<GeneratedAdventurePackImage> {
    console.log('[PollinationsImageAdapter] ✅ VERSIÓN CORREGIDA - Construyendo URL de imagen')
    console.log(`[PollinationsImageAdapter] Prompt original: ${prompt}`)

    // Aplicar style wrapper al prompt
    const enhancedPrompt = this.enhancePrompt(prompt)
    console.log(`[PollinationsImageAdapter] Prompt mejorado: ${enhancedPrompt}`)

    // Generar seed aleatorio para variedad en las imágenes
    const seed = this.generateRandomSeed()

    // Construir URL de la imagen con parámetros
    const imageUrl = this.buildImageUrl(enhancedPrompt, seed)

    console.log(`[PollinationsImageAdapter] ✅ URL construida (seed: ${seed})`)
    console.log(`[PollinationsImageAdapter] ✅ Base URL: gen.pollinations.ai/image (CORRECTO)`)
    console.log(`[PollinationsImageAdapter] ✅ Auth param: key= (CORRECTO)`)
    console.log(`[PollinationsImageAdapter] URL completa: ${imageUrl}`)

    // Devolver URL inmediatamente - el navegador hará la petición GET
    return {
      url: imageUrl,
      prompt: enhancedPrompt,
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
   * Formato: https://gen.pollinations.ai/image/{prompt}?width=1024&height=1024&model=flux&seed=123&nologo=true&key=API_KEY
   *
   * El navegador hará la petición GET directamente, sin bloquear el servidor.
   *
   * @param prompt - Prompt de la imagen (será URL-encoded)
   * @param seed - Seed para la generación
   * @returns URL completa de la imagen para renderizado directo
   */
  private buildImageUrl(prompt: string, seed: number): string {
    // Codificar el prompt para URL
    const encodedPrompt = encodeURIComponent(prompt)

    // Construir query string con parámetros optimizados
    const params = new URLSearchParams({
      width: this.defaultParams.width!.toString(),
      height: this.defaultParams.height!.toString(),
      model: this.defaultParams.model!,
      seed: seed.toString(),
      nologo: this.defaultParams.nologo!.toString(),
      enhance: this.defaultParams.enhance!.toString(),
    })

    // Si hay API key, añadirla como parámetro key
    if (this.apiKey) {
      params.append('key', this.apiKey)
    }

    return `${this.baseUrl}/${encodedPrompt}?${params.toString()}`
  }

}

/**
 * Factory para crear instancia del adapter con configuración por defecto.
 * Facilita la inyección de dependencias en los casos de uso.
 */
export function createPollinationsImageAdapter(): PollinationsImageAdapter {
  return new PollinationsImageAdapter()
}
