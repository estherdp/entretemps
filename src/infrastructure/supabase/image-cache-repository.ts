// src/infrastructure/supabase/image-cache-repository.ts

import { supabase } from './supabase-client'
import type { ImageCache } from '@/domain/image-cache'
import type { IImageCacheRepository } from '@/domain/repositories'

/**
 * Implementación de IImageCacheRepository usando Supabase.
 *
 * Reduce llamadas a APIs externas almacenando resultados por query.
 * Implementa expiración de 24 horas para mantener contenido fresco.
 *
 * Tabla requerida en Supabase:
 * ```sql
 * CREATE TABLE image_cache (
 *   query TEXT PRIMARY KEY,
 *   url TEXT NOT NULL,
 *   photographer TEXT,
 *   source_url TEXT,
 *   created_at TIMESTAMPTZ DEFAULT NOW()
 * );
 *
 * -- Índice para búsquedas por fecha (opcional pero recomendado)
 * CREATE INDEX idx_image_cache_created_at ON image_cache(created_at);
 * ```
 */
export class ImageCacheRepository implements IImageCacheRepository {
  private readonly cacheExpirationHours = 24

  /**
   * Busca una entrada en caché por query.
   * Solo devuelve resultados no expirados (últimas 24h).
   *
   * @param query - Query de búsqueda usada originalmente
   * @returns ImageCache si existe y no está expirada, null en caso contrario
   */
  async get(query: string): Promise<ImageCache | null> {
    try {
      const expirationDate = new Date()
      expirationDate.setHours(expirationDate.getHours() - this.cacheExpirationHours)

      const { data, error } = await supabase
        .from('image_cache')
        .select('*')
        .eq('query', query)
        .gte('created_at', expirationDate.toISOString())
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // No rows found - cache miss
          return null
        }
        console.error('[ImageCacheRepository] Error fetching cache:', error)
        return null
      }

      return {
        query: data.query,
        url: data.url,
        photographer: data.photographer,
        sourceUrl: data.source_url,
        createdAt: data.created_at,
      }
    } catch (error) {
      console.error('[ImageCacheRepository] Unexpected error fetching cache:', error)
      return null
    }
  }

  /**
   * Guarda o actualiza una entrada en caché.
   * Usa upsert para manejar duplicados automáticamente.
   *
   * @param entry - Datos a almacenar en caché
   */
  async set(entry: Omit<ImageCache, 'createdAt'>): Promise<void> {
    try {
      const { error } = await supabase.from('image_cache').upsert(
        {
          query: entry.query,
          url: entry.url,
          photographer: entry.photographer,
          source_url: entry.sourceUrl,
          created_at: new Date().toISOString(),
        },
        {
          onConflict: 'query',
        }
      )

      if (error) {
        console.error('[ImageCacheRepository] Error saving to cache:', error)
      }
    } catch (error) {
      console.error('[ImageCacheRepository] Unexpected error saving to cache:', error)
    }
  }

  /**
   * Elimina entradas expiradas de la caché.
   * Útil para ejecutar en un cron job o background task.
   *
   * @returns Número de entradas eliminadas
   */
  async cleanExpired(): Promise<number> {
    try {
      const expirationDate = new Date()
      expirationDate.setHours(expirationDate.getHours() - this.cacheExpirationHours)

      const { data, error } = await supabase
        .from('image_cache')
        .delete()
        .lt('created_at', expirationDate.toISOString())
        .select('query')

      if (error) {
        console.error('[ImageCacheRepository] Error cleaning cache:', error)
        return 0
      }

      return data?.length || 0
    } catch (error) {
      console.error('[ImageCacheRepository] Unexpected error cleaning cache:', error)
      return 0
    }
  }
}
