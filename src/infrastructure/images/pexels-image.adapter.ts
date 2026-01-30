// src/infrastructure/images/pexels-image.adapter.ts

import type { IImageSearcher, ImageSearchResult } from '@/domain/services'

/**
 * Respuesta de la API de Pexels para búsqueda de imágenes.
 * Documentación: https://www.pexels.com/api/documentation/#photos-search
 */
interface PexelsSearchResponse {
  photos: Array<{
    id: number
    width: number
    height: number
    url: string // URL de la página de la foto en Pexels
    photographer: string
    photographer_url: string
    photographer_id: number
    src: {
      original: string
      large2x: string
      large: string
      medium: string
      small: string
      portrait: string
      landscape: string
      tiny: string
    }
    alt: string
  }>
  total_results: number
  page: number
  per_page: number
  next_page?: string
}

/**
 * Adaptador para búsqueda de imágenes usando la API de Pexels.
 *
 * Implementa IImageSearcher para obtener fotografías reales
 * de alta calidad como alternativa a la generación por IA.
 *
 * Características:
 * - Búsqueda por keywords en inglés
 * - Orientación landscape para portadas
 * - Atribución automática al fotógrafo
 * - Manejo de errores robusto (devuelve null en caso de fallo)
 *
 * @see https://www.pexels.com/api/documentation/
 */
export class PexelsImageAdapter implements IImageSearcher {
  private readonly apiKey: string
  private readonly baseUrl = 'https://api.pexels.com/v1'

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.PEXELS_API_KEY || ''

    if (!this.apiKey) {
      console.warn('[PexelsImageAdapter] PEXELS_API_KEY not configured. Image search will fail.')
    }
  }

  /**
   * Busca una imagen de portada en Pexels basada en la query proporcionada.
   *
   * @param query - Keywords de búsqueda (preferiblemente en inglés)
   * @returns ImageSearchResult con la mejor imagen encontrada, o null si falla
   */
  async searchCoverImage(query: string): Promise<ImageSearchResult | null> {
    if (!this.apiKey) {
      console.error('[PexelsImageAdapter] Cannot search without API key')
      return null
    }

    if (!query || query.trim().length === 0) {
      console.error('[PexelsImageAdapter] Query cannot be empty')
      return null
    }

    try {
      // Construir URL con parámetros: 1 resultado, orientación landscape
      const url = new URL(`${this.baseUrl}/search`)
      url.searchParams.set('query', query.trim())
      url.searchParams.set('per_page', '1')
      url.searchParams.set('orientation', 'landscape')

      console.log(`[PexelsImageAdapter] Searching for: "${query}"`)

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          Authorization: this.apiKey,
        },
      })

      if (!response.ok) {
        console.error(
          `[PexelsImageAdapter] API error: ${response.status} ${response.statusText}`
        )
        return null
      }

      const data: PexelsSearchResponse = await response.json()

      if (!data.photos || data.photos.length === 0) {
        console.warn(`[PexelsImageAdapter] No images found for query: "${query}"`)
        return null
      }

      // Seleccionar la primera imagen (mejor match según Pexels)
      const photo = data.photos[0]

      // Preferir "large" para buena calidad sin ser excesivo
      const imageUrl = photo.src.large || photo.src.landscape || photo.src.original

      const result: ImageSearchResult = {
        url: imageUrl,
        prompt: query, // Guardamos la query usada
        attribution: {
          photographer: photo.photographer,
          sourceUrl: photo.url, // URL de la foto en Pexels
        },
      }

      console.log(
        `[PexelsImageAdapter] Found image by ${photo.photographer} (ID: ${photo.id})`
      )

      return result
    } catch (error) {
      console.error('[PexelsImageAdapter] Search failed:', error)
      return null
    }
  }
}

/**
 * Factory para crear instancia del adapter con configuración por defecto.
 * Facilita la inyección de dependencias en los casos de uso.
 */
export function createPexelsImageAdapter(): PexelsImageAdapter {
  return new PexelsImageAdapter()
}
