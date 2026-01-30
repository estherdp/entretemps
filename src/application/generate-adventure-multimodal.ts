// src/application/generate-adventure-multimodal.ts

import type { WizardData } from '@/domain/wizard-data'
import type { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'
import type { IAdventureProvider, IImageGenerator, IImageSearcher } from '@/domain/services'
import type { ImageCacheRepository } from '@/infrastructure/supabase/image-cache-repository'

interface GenerateAdventureMultimodalResult {
  ok: boolean
  error?: string
  pack?: GeneratedAdventurePack
  warnings?: string[]
}

/**
 * Construye una query de búsqueda optimizada para Pexels.
 * Extrae keywords relevantes del pack para obtener mejores resultados.
 *
 * @param pack - Pack generado con información de la aventura
 * @returns Query en inglés con 4-6 keywords
 */
function buildImageSearchQuery(pack: GeneratedAdventurePack): string {
  const keywords: string[] = []

  // Agregar tipo de aventura (importante para el tema)
  if (pack.adventureType) {
    keywords.push(pack.adventureType)
  }

  // Agregar lugar (contexto espacial)
  if (pack.place) {
    keywords.push(pack.place)
  }

  // Agregar tono (atmósfera)
  if (pack.tone) {
    keywords.push(pack.tone)
  }

  // Si existe prompt de imagen, extraer primeras 2-3 palabras clave
  if (pack.image?.prompt) {
    const promptWords = pack.image.prompt
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 3) // Solo palabras significativas
      .slice(0, 3)
    keywords.push(...promptWords)
  }

  // Agregar "children adventure" para mejorar resultados child-safe
  keywords.push('children', 'adventure')

  // Limitar a 6 keywords y construir query
  return keywords.slice(0, 6).join(' ')
}

/**
 * Caso de Uso: Generar una aventura con multimodalidad (Texto + Imagen).
 *
 * ORQUESTADOR MULTIMODAL:
 * Este caso de uso coordina proveedores de IA y búsqueda de imágenes:
 * 1. IAdventureProvider: Genera el texto de la aventura y el prompt de imagen
 * 2. IImageSearcher: Busca imágenes reales en Pexels (prioritario, con caché)
 * 3. IImageGenerator: Genera imágenes por IA (fallback si no hay searcher)
 *
 * FLUJO SECUENCIAL CON ESTRATEGIA DE IMAGEN:
 * 1. Genera la aventura (texto + prompt de imagen)
 * 2. Intenta búsqueda de imagen real (Pexels):
 *    - Consulta caché primero (24h)
 *    - Si no hay en caché, busca en Pexels y guarda resultado
 * 3. Si búsqueda falla, intenta generación de imagen por IA (fallback)
 * 4. Si todo falla, usa placeholder
 * 5. Retorna el pack completo listo para persistir en Supabase
 *
 * RESILIENCIA:
 * - Si la búsqueda/generación de imagen falla, mantiene un placeholder
 * - Registra warnings pero no falla toda la operación
 * - La aventura (texto) siempre se guarda, incluso sin imagen
 *
 * COMPATIBILIDAD CON SUPABASE:
 * - El objeto retornado cumple con GeneratedAdventurePack
 * - Puede ser guardado directamente con save-adventure-pack.ts
 *
 * @param wizardData - Datos del wizard
 * @param adventureProvider - Proveedor de generación de texto
 * @param imageSearcher - Buscador de imágenes (Pexels, opcional pero recomendado)
 * @param imageCacheRepo - Repositorio de caché (opcional, mejora performance)
 * @param imageGenerator - Generador de imágenes por IA (fallback opcional)
 * @returns Resultado con el pack completo o error
 */
export async function generateAdventureMultimodal(
  wizardData: WizardData,
  adventureProvider: IAdventureProvider,
  imageSearcher?: IImageSearcher,
  imageCacheRepo?: ImageCacheRepository,
  imageGenerator?: IImageGenerator
): Promise<GenerateAdventureMultimodalResult> {
  const warnings: string[] = []

  try {
    // PASO 1: Generar la aventura (texto + prompt de imagen)
    const pack = await adventureProvider.generateAdventure(wizardData, 'es', {
      phases: 3,
      puzzlesPerPhase: 2,
      screenFree: true,
    })

    let imageObtained = false

    // PASO 2: PRIORIDAD - Intentar búsqueda de imagen real (Pexels con caché)
    if (imageSearcher) {
      try {
        // Construir query optimizada para búsqueda
        const searchQuery = buildImageSearchQuery(pack)
        console.log(`[generateAdventureMultimodal] Buscando imagen con query: "${searchQuery}"`)

        let searchResult = null

        // 2.1: Intentar obtener de caché primero
        if (imageCacheRepo) {
          searchResult = await imageCacheRepo.get(searchQuery)
          if (searchResult) {
            console.log('[generateAdventureMultimodal] Imagen encontrada en caché')
          }
        }

        // 2.2: Si no hay en caché, buscar en Pexels
        if (!searchResult) {
          console.log('[generateAdventureMultimodal] Buscando en Pexels...')
          searchResult = await imageSearcher.searchCoverImage(searchQuery)

          // 2.3: Guardar en caché si se encontró resultado
          if (searchResult && imageCacheRepo) {
            await imageCacheRepo.set({
              query: searchQuery,
              url: searchResult.url,
              photographer: searchResult.attribution?.photographer ?? null,
              sourceUrl: searchResult.attribution?.sourceUrl ?? null,
            })
            console.log('[generateAdventureMultimodal] Resultado guardado en caché')
          }
        }

        // 2.4: Si se encontró imagen, actualizar el pack
        if (searchResult) {
          pack.image = {
            url: searchResult.url,
            prompt: searchResult.prompt,
          }
          imageObtained = true

          if (searchResult.attribution) {
            warnings.push(
              `Imagen por ${searchResult.attribution.photographer} (Pexels)`
            )
          }
        }
      } catch (searchError) {
        const errorMessage =
          searchError instanceof Error ? searchError.message : 'Error desconocido'
        console.error('[generateAdventureMultimodal] Error en búsqueda de imagen:', searchError)
        warnings.push(`Búsqueda de imagen falló: ${errorMessage}`)
      }
    }

    // PASO 3: FALLBACK - Si no se obtuvo imagen por búsqueda, intentar generación por IA
    if (!imageObtained && imageGenerator && pack.image?.prompt) {
      try {
        console.log('[generateAdventureMultimodal] Generando imagen por IA...')
        const newImage = await imageGenerator.generateImage(pack.image.prompt)

        pack.image = {
          url: newImage.url,
          prompt: newImage.prompt,
        }
        imageObtained = true

        // Solo agregar warning si imageGenerator se usa como fallback (después de que searcher falló)
        if (imageSearcher) {
          warnings.push('Imagen generada por IA')
        }
      } catch (imageError) {
        const errorMessage =
          imageError instanceof Error ? imageError.message : 'Error desconocido'

        console.error('[generateAdventureMultimodal] Error en generación de imagen:', imageError)
        warnings.push(`Generación de imagen falló: ${errorMessage}`)
      }
    }

    // PASO 4: ÚLTIMO RECURSO - Placeholder si todo falló
    if (!imageObtained || !pack.image || !pack.image.url) {
      console.warn('[generateAdventureMultimodal] No se pudo obtener imagen, usando placeholder')
      pack.image = {
        url: 'https://placehold.co/800x600/1a1a1a/ffffff?text=Imagen+No+Disponible',
        prompt: pack.image?.prompt || 'Sin prompt de imagen disponible',
      }
      warnings.push('No se pudo obtener imagen. Usando placeholder.')
    }

    return {
      ok: true,
      pack,
      warnings: warnings.length > 0 ? warnings : undefined,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    console.error('[generateAdventureMultimodal] Error general:', error)
    return {
      ok: false,
      error: `Error al generar la aventura: ${errorMessage}`,
      warnings: warnings.length > 0 ? warnings : undefined,
    }
  }
}
