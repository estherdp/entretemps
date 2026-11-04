// src/application/generate-adventure-multimodal.ts

import type { WizardData } from '@/domain/wizard-data'
import type { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'
import type { IAdventureProvider, IImageGenerator, IImageSearcher, ImageSearchResult } from '@/domain/services'
import type { ImageCache } from '@/domain/image-cache'
import type { IImageCacheRepository } from '@/domain/repositories'
import { AIProviderQuotaError } from '@/domain/errors'
import { buildAdventureConstraints } from './adventure-constraints'

interface GenerateAdventureMultimodalResult {
  ok: boolean
  error?: string
  errorCode?: 'ai_quota'
  pack?: GeneratedAdventurePack
  warnings?: string[]
}

/**
 * Construye una query de búsqueda para Pexels a partir de los metadatos del pack.
 */
function buildImageSearchQuery(pack: GeneratedAdventurePack): string {
  const titleWords = pack.title
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .slice(0, 2)

  return [pack.adventureType, pack.place, ...titleWords, 'children', 'adventure'].slice(0, 6).join(' ')
}

/**
 * Construye el prompt de portada para un generador de imágenes por IA.
 */
function buildCoverImagePrompt(pack: GeneratedAdventurePack): string {
  const narrator = pack.narrator ? `, featuring ${pack.narrator.name}` : ''
  return `Children's book illustration for an adventure called "${pack.title}"${narrator}. ` +
    `Theme: ${pack.adventureType}, setting: ${pack.place}, mood: ${pack.tone}. Warm, friendly, no text.`
}

/**
 * Caso de Uso: Generar una aventura, con portada opcional.
 *
 * El texto es lo esencial y siempre se genera. La portada es OPCIONAL:
 * solo se intenta si se inyecta un IImageGenerator o un IImageSearcher.
 * Por defecto la aplicación no los inyecta (coste y calidad), y la UI
 * muestra una ilustración propia según el tipo de aventura.
 *
 * Estrategia de portada cuando está activada:
 * 1. IImageGenerator (IA) si está configurado.
 * 2. IImageSearcher (Pexels) como alternativa, con caché.
 * 3. Si ambos fallan, el pack se devuelve sin imagen y con un warning.
 *
 * @param wizardData - Datos del wizard
 * @param adventureProvider - Proveedor de generación de texto
 * @param imageSearcher - Buscador de imágenes (opcional)
 * @param imageCacheRepo - Caché de búsquedas de imágenes (opcional)
 * @param imageGenerator - Generador de imágenes por IA (opcional)
 */
export async function generateAdventureMultimodal(
  wizardData: WizardData,
  adventureProvider: IAdventureProvider,
  imageSearcher?: IImageSearcher,
  imageCacheRepo?: IImageCacheRepository,
  imageGenerator?: IImageGenerator
): Promise<GenerateAdventureMultimodalResult> {
  const warnings: string[] = []

  try {
    const pack = await adventureProvider.generateAdventure(
      wizardData,
      'es',
      buildAdventureConstraints(wizardData)
    )

    const coversEnabled = Boolean(imageGenerator || imageSearcher)
    let imageObtained = false

    if (imageGenerator) {
      try {
        const newImage = await imageGenerator.generateImage(buildCoverImagePrompt(pack))
        pack.image = { url: newImage.url, prompt: newImage.prompt }
        imageObtained = true
      } catch (imageError) {
        const errorMessage = imageError instanceof Error ? imageError.message : 'Error desconocido'
        warnings.push(`Generación de imagen falló: ${errorMessage}`)
      }
    }

    if (!imageObtained && imageSearcher) {
      try {
        const searchQuery = buildImageSearchQuery(pack)
        let searchResult: ImageCache | ImageSearchResult | null = imageCacheRepo
          ? await imageCacheRepo.get(searchQuery)
          : null

        if (!searchResult) {
          searchResult = await imageSearcher.searchCoverImage(searchQuery)

          if (searchResult && imageCacheRepo) {
            await imageCacheRepo.save({
              query: searchQuery,
              url: searchResult.url,
              photographer: searchResult.attribution?.photographer ?? null,
              sourceUrl: searchResult.attribution?.sourceUrl ?? null,
            })
          }
        }

        if (searchResult) {
          pack.image = {
            url: searchResult.url,
            // ImageSearchResult tiene 'prompt', ImageCache tiene 'query'
            prompt: 'prompt' in searchResult ? searchResult.prompt : searchResult.query,
          }
          imageObtained = true

          if ('attribution' in searchResult && searchResult.attribution) {
            warnings.push(`Imagen por ${searchResult.attribution.photographer} (Pexels)`)
          }
        }
      } catch (searchError) {
        const errorMessage = searchError instanceof Error ? searchError.message : 'Error desconocido'
        warnings.push(`Búsqueda de imagen falló: ${errorMessage}`)
      }
    }

    if (coversEnabled && !imageObtained) {
      warnings.push('No se pudo obtener portada. Se usará la ilustración por defecto.')
    }

    return {
      ok: true,
      pack,
      warnings: warnings.length > 0 ? warnings : undefined,
    }
  } catch (error) {
    if (error instanceof AIProviderQuotaError) {
      return { ok: false, errorCode: 'ai_quota', error: error.message }
    }

    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    console.error('[generateAdventureMultimodal] Error general:', error)
    return {
      ok: false,
      error: `Error al generar la aventura: ${errorMessage}`,
      warnings: warnings.length > 0 ? warnings : undefined,
    }
  }
}
