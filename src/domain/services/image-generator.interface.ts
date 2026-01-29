// src/domain/services/image-generator.interface.ts

import type { GeneratedAdventurePackImage } from '@/domain/generated-adventure-pack'

/**
 * Puerto (Interface) para generadores de imágenes mediante IA.
 *
 * Define el contrato para servicios de generación de imágenes
 * (DALL-E, Stable Diffusion, Nanobanana, etc.)
 *
 * Clean Architecture: Esta interfaz pertenece a la capa de dominio
 * y NO debe tener dependencias de librerías externas.
 *
 * Nota: Por ahora, los proveedores de aventura (n8n) devuelven la imagen
 * incluida. Esta interfaz está preparada para cuando se separe la
 * generación de texto de la generación de imagen.
 */
export interface IImageGenerator {
  /**
   * Genera una imagen basada en un prompt de texto.
   *
   * @param prompt - Descripción textual de la imagen a generar
   * @returns Promise con la imagen generada (URL y prompt)
   * @throws Error si la generación falla
   */
  generateImage(prompt: string): Promise<GeneratedAdventurePackImage>
}
