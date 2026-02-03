// src/app/api/generate-adventure/route.ts

import { NextResponse } from 'next/server'

// Vercel Serverless Function Configuration
// maxDuration: Timeout extendido a 60s para llamadas a APIs de IA (Gemini, Pollinations)
// dynamic: Fuerza generación dinámica, sin caché
export const maxDuration = 60
export const dynamic = 'force-dynamic'
import { generateAdventureMultimodal } from '@/application/generate-adventure-multimodal'
import { GeminiAdapter, NanobananaAdapter, PollinationsImageAdapter } from '@/infrastructure/ai/adapters'
import { N8NAdapter } from '@/infrastructure/n8n/n8n-adapter'
import { PexelsImageAdapter } from '@/infrastructure/images'
import { ImageCacheRepository } from '@/infrastructure/supabase'
import type { WizardData } from '@/domain/wizard-data'
import type { IImageGenerator } from '@/domain/services'

/**
 * API Route para generar aventuras con IA.
 *
 * ACTUALIZADO: Usa generateAdventureMultimodal con estrategia multimodal de imágenes.
 *
 * Flujo de imágenes (prioridad invertida):
 * 1. Si hay IMAGE_GENERATOR_PROVIDER configurado, genera imagen por IA (PRIORIDAD)
 * 2. Si falla (ej. sin créditos) o no hay generador, busca en Pexels (FALLBACK)
 * 3. Si todo falla, usa placeholder
 *
 * Proveedores de generación de imágenes disponibles:
 * - 'nanobanana': Google Gemini 2.5 Flash Image (requiere GEMINI_API_KEY)
 * - 'pollinations': Pollinations AI con modelo Flux (requiere POLLINATIONS_API_KEY)
 * - undefined: Sin generador (solo usa Pexels + placeholder)
 *
 * Server-only: Tiene acceso a variables de entorno privadas.
 * El cliente (step-6) hace un POST a esta ruta con los datos del wizard.
 */
export async function POST(request: Request) {
  try {
    const wizardData: WizardData = await request.json()

    // Seleccionar provider de texto basado en configuración
    const aiProvider = process.env.AI_PROVIDER || 'gemini'
    let provider

    switch (aiProvider) {
      case 'gemini':
        try {
          // GeminiAdapter lee GEMINI_API_KEY de process.env (server-only)
          provider = new GeminiAdapter()
          break
        } catch (error) {
          return NextResponse.json(
            {
              ok: false,
              error: `Gemini no configurado: ${error instanceof Error ? error.message : 'Error desconocido'}`,
            },
            { status: 500 }
          )
        }

      case 'n8n':
        try {
          provider = new N8NAdapter()
          break
        } catch (error) {
          return NextResponse.json(
            {
              ok: false,
              error: `N8N no configurado: ${error instanceof Error ? error.message : 'Error desconocido'}`,
            },
            { status: 500 }
          )
        }

      default:
        return NextResponse.json(
          {
            ok: false,
            error: `Provider desconocido: ${aiProvider}. Use 'gemini' o 'n8n'`,
          },
          { status: 400 }
        )
    }

    // Configurar búsqueda de imágenes con Pexels
    const imageSearcher = new PexelsImageAdapter() // Lee PEXELS_API_KEY del env
    const imageCacheRepo = new ImageCacheRepository()

    // Configurar generador de imágenes (opcional, usado como fallback)
    // Options: 'nanobanana', 'pollinations', undefined (sin generador)
    const imageGeneratorType = process.env.IMAGE_GENERATOR_PROVIDER
    let imageGenerator: IImageGenerator | undefined

    if (imageGeneratorType) {
      try {
        switch (imageGeneratorType) {
          case 'nanobanana':
            imageGenerator = new NanobananaAdapter()
            console.log('[generate-adventure API] Usando NanobananaAdapter para generación de imágenes')
            break

          case 'pollinations':
            imageGenerator = new PollinationsImageAdapter()
            console.log('[generate-adventure API] Usando PollinationsImageAdapter para generación de imágenes')
            break

          default:
            console.warn(`[generate-adventure API] IMAGE_GENERATOR_PROVIDER desconocido: ${imageGeneratorType}. No se usará generador de imágenes.`)
            imageGenerator = undefined
        }
      } catch (error) {
        console.warn(
          `[generate-adventure API] Error al inicializar generador de imágenes: ${error instanceof Error ? error.message : 'Error desconocido'}`
        )
        imageGenerator = undefined
      }
    }

    // Generar aventura usando el orquestador multimodal
    const result = await generateAdventureMultimodal(
      wizardData,
      provider,
      imageSearcher,    // Busca en Pexels (fallback si generador falla)
      imageCacheRepo,   // Usa caché de 24h para optimizar
      imageGenerator    // Generador IA (prioridad si está configurado)
    )

    if (result.ok) {
      return NextResponse.json({
        ok: true,
        pack: result.pack,
        warnings: result.warnings, // Incluye info de atribución de Pexels
      })
    } else {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    console.error('[generate-adventure API] Error:', error)
    return NextResponse.json(
      { ok: false, error: `Error al procesar la solicitud: ${errorMessage}` },
      { status: 500 }
    )
  }
}
