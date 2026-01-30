// src/domain/image-cache.ts

/**
 * Entrada de caché para búsquedas de imágenes.
 *
 * Almacena resultados de búsqueda para evitar llamadas
 * repetidas a APIs externas (Pexels, Unsplash, etc.)
 */
export interface ImageCache {
  query: string
  url: string
  photographer: string | null
  sourceUrl: string | null
  createdAt: string
}
