// src/domain/repositories/image-cache-repository.interface.ts

import type { ImageCache } from '@/domain/image-cache'

/**
 * Interfaz del repositorio de caché de imágenes.
 *
 * Define el contrato para almacenar resultados de búsqueda de imágenes
 * sin acoplar el dominio a ninguna implementación concreta.
 */
export interface IImageCacheRepository {
  /**
   * Obtiene una entrada de caché si existe y no ha expirado.
   *
   * @param query - Query de búsqueda
   * @returns Entrada de caché o null si no existe/expiró
   */
  get(query: string): Promise<ImageCache | null>

  /**
   * Guarda una entrada en caché.
   *
   * @param cache - Datos de la imagen a cachear
   */
  save(cache: Omit<ImageCache, 'createdAt'>): Promise<void>

  /**
   * Limpia entradas de caché expiradas.
   *
   * @param hoursToExpire - Número de horas después de las cuales una entrada expira
   */
  cleanExpired(hoursToExpire?: number): Promise<void>
}
