// src/app/api/generate-adventure/route.ts

import { NextResponse } from 'next/server'

// Vercel Serverless Function Configuration
// maxDuration: Timeout extendido a 60s para llamadas a APIs de IA
// dynamic: Fuerza generación dinámica, sin caché
export const maxDuration = 60
export const dynamic = 'force-dynamic'
import { generateAdventureMultimodal } from '@/application/generate-adventure-multimodal'
import { assertGenerationQuota, parseQuotaLimit } from '@/application/generation-quota'
import { UserQuotaExceededError } from '@/domain/errors'
import { GeminiAdapter, NanobananaAdapter, PollinationsImageAdapter } from '@/infrastructure/ai/adapters'
import { N8NAdapter } from '@/infrastructure/n8n/n8n-adapter'
import { PexelsImageAdapter } from '@/infrastructure/images'
import { GenerationUsageRepository, ImageCacheRepository } from '@/infrastructure/supabase'
import { getCurrentUserServer, createSupabaseServerClient } from '@/infrastructure/supabase/auth-server'
import type { WizardData } from '@/domain/wizard-data'
import type { IAdventureProvider, IImageGenerator, IImageSearcher } from '@/domain/services'

/**
 * Composition root del proveedor de texto: el único sitio que sabe
 * qué adaptador concreto se usa (AI_PROVIDER).
 */
function createAdventureProvider(): IAdventureProvider {
  const aiProvider = process.env.AI_PROVIDER || 'gemini'

  switch (aiProvider) {
    case 'gemini':
      return new GeminiAdapter()
    case 'n8n':
      return new N8NAdapter()
    default:
      throw new Error(`Provider desconocido: ${aiProvider}. Use 'gemini' o 'n8n'`)
  }
}

/**
 * Portadas: desactivadas por defecto para no consumir cuota ni crédito.
 * Se activan con ENABLE_COVER_IMAGES=true.
 */
function createCoverImageDependencies(): {
  imageGenerator?: IImageGenerator
  imageSearcher?: IImageSearcher
  imageCacheRepo?: ImageCacheRepository
} {
  if (process.env.ENABLE_COVER_IMAGES !== 'true') {
    return {}
  }

  let imageGenerator: IImageGenerator | undefined
  try {
    switch (process.env.IMAGE_GENERATOR_PROVIDER) {
      case 'nanobanana':
        imageGenerator = new NanobananaAdapter()
        break
      case 'pollinations':
        imageGenerator = new PollinationsImageAdapter()
        break
    }
  } catch (error) {
    console.warn('[generate-adventure API] No se pudo inicializar el generador de imágenes:', error)
  }

  const imageSearcher = process.env.PEXELS_API_KEY ? new PexelsImageAdapter() : undefined

  return {
    imageGenerator,
    imageSearcher,
    imageCacheRepo: imageSearcher ? new ImageCacheRepository() : undefined,
  }
}

/**
 * POST /api/generate-adventure
 *
 * Genera una aventura con IA para el usuario autenticado.
 *
 * Errors:
 * - 401: No autenticado
 * - 429: Cuota del usuario agotada o límite del proveedor de IA alcanzado
 * - 500: Error de configuración o de generación
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUserServer()
    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'Inicia sesión para crear aventuras.' },
        { status: 401 }
      )
    }

    const supabaseServer = await createSupabaseServerClient()
    const usageRepo = new GenerationUsageRepository(supabaseServer)
    const dailyLimit = parseQuotaLimit(process.env.DAILY_ADVENTURE_LIMIT, 5)

    await assertGenerationQuota(user.id, 'adventure', dailyLimit, usageRepo)

    const wizardData: WizardData = await request.json()

    let provider: IAdventureProvider
    try {
      provider = createAdventureProvider()
    } catch (error) {
      return NextResponse.json(
        { ok: false, error: `Proveedor de IA no configurado: ${error instanceof Error ? error.message : 'Error desconocido'}` },
        { status: 500 }
      )
    }

    const { imageGenerator, imageSearcher, imageCacheRepo } = createCoverImageDependencies()

    const result = await generateAdventureMultimodal(
      wizardData,
      provider,
      imageSearcher,
      imageCacheRepo,
      imageGenerator
    )

    if (!result.ok) {
      if (result.errorCode === 'ai_quota') {
        return NextResponse.json(
          { ok: false, error: 'Hoy se han creado muchas aventuras y la IA necesita descansar. Prueba más tarde o elige una plantilla.' },
          { status: 429 }
        )
      }
      return NextResponse.json({ ok: false, error: result.error }, { status: 500 })
    }

    // Solo se descuenta cuota cuando la generación ha ido bien.
    await usageRepo.record(user.id, 'adventure')

    return NextResponse.json({
      ok: true,
      pack: result.pack,
      warnings: result.warnings,
    })
  } catch (error) {
    if (error instanceof UserQuotaExceededError) {
      return NextResponse.json(
        { ok: false, error: `${error.message}. Mientras tanto, puedes jugar con las plantillas.` },
        { status: 429 }
      )
    }

    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    console.error('[generate-adventure API] Error:', error)
    return NextResponse.json(
      { ok: false, error: `Error al procesar la solicitud: ${errorMessage}` },
      { status: 500 }
    )
  }
}
