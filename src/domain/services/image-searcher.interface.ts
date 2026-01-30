// src/domain/services/image-searcher.interface.ts

/**
 * Resultado de búsqueda de imágenes con información de atribución.
 */
export interface ImageSearchResult {
  url: string
  prompt: string
  attribution?: {
    photographer: string
    sourceUrl: string
  }
}

/**
 * Puerto (Interface) para buscadores de imágenes en bancos de fotos.
 *
 * Define el contrato para servicios de búsqueda de imágenes
 * (Pexels, Unsplash, Pixabay, etc.)
 *
 * Clean Architecture: Esta interfaz pertenece a la capa de dominio
 * y NO debe tener dependencias de librerías externas.
 *
 * Se utiliza como alternativa a la generación de imágenes por IA,
 * buscando fotografías reales que coincidan con la temática de la aventura.
 */
export interface IImageSearcher {
  /**
   * Busca una imagen relevante basada en una query de texto.
   *
   * @param query - Términos de búsqueda (keywords relacionadas con la aventura)
   * @returns Promise con el resultado de la búsqueda, o null si no se encontró
   */
  searchCoverImage(query: string): Promise<ImageSearchResult | null>
}
