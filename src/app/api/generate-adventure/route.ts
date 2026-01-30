// src/app/api/generate-adventure/route.ts

import { NextResponse } from 'next/server'
import { generateAdventureMultimodal } from '@/application/generate-adventure-multimodal'
import { GeminiAdapter } from '@/infrastructure/ai/adapters'
import { N8NAdapter } from '@/infrastructure/n8n/n8n-adapter'
import { PexelsImageAdapter } from '@/infrastructure/images'
import { ImageCacheRepository } from '@/infrastructure/supabase'
import type { WizardData } from '@/domain/wizard-data'

/**
 * API Route para generar aventuras con IA.
 *
 * ACTUALIZADO: Ahora usa generateAdventureMultimodal con Pexels para imágenes reales.
 *
 * Flujo de imágenes:
 * 1. Busca en Pexels (prioridad) - imágenes reales de alta calidad
 * 2. Si falla, usa placeholder (no genera por IA para ahorrar costes)
 *
 * Server-only: Tiene acceso a variables de entorno privadas como GEMINI_API_KEY y PEXELS_API_KEY.
 * El cliente (step-6) hace un POST a esta ruta con los datos del wizard.
 */
export async function POST(request: Request) {
  try {
    const wizardData: WizardData = await request.json()

    // Seleccionar provider de texto basado en configuración
    const aiProvider = process.env.NEXT_PUBLIC_AI_PROVIDER || 'gemini'
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

    // Generar aventura usando el orquestador multimodal
    const result = await generateAdventureMultimodal(
      wizardData,
      provider,
      imageSearcher,    // Busca en Pexels (prioridad)
      imageCacheRepo,   // Usa caché de 24h para optimizar
      undefined         // Sin generador IA (ahorramos costes)
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
