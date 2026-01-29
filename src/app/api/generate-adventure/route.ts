// src/app/api/generate-adventure/route.ts

import { NextResponse } from 'next/server'
import { generatePack } from '@/application/generate-pack'
import { GeminiAdapter } from '@/infrastructure/ai/adapters'
import { N8NAdapter } from '@/infrastructure/n8n/n8n-adapter'
import type { WizardData } from '@/domain/wizard-data'

/**
 * API Route para generar aventuras con IA.
 *
 * Server-only: Tiene acceso a variables de entorno privadas como GEMINI_API_KEY.
 * El cliente (step-6) hace un POST a esta ruta con los datos del wizard.
 */
export async function POST(request: Request) {
  try {
    const wizardData: WizardData = await request.json()

    // Seleccionar provider basado en configuración
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

    // Generar aventura usando el caso de uso
    const result = await generatePack(wizardData, provider)

    if (result.ok) {
      return NextResponse.json({ ok: true, pack: result.pack })
    } else {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    return NextResponse.json(
      { ok: false, error: `Error al procesar la solicitud: ${errorMessage}` },
      { status: 500 }
    )
  }
}
