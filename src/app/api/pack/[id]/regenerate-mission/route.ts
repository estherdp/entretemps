// src/app/api/pack/[id]/regenerate-mission/route.ts

import { NextRequest, NextResponse } from 'next/server'

// Vercel Serverless Function Configuration
// maxDuration: Timeout extendido a 60s para llamadas a APIs de IA (Gemini)
// dynamic: Fuerza generación dinámica, sin caché
export const maxDuration = 60
export const dynamic = 'force-dynamic'
import { regenerateMission } from '@/application/regenerate-mission'
import { GeminiAdapter } from '@/infrastructure/ai/adapters/gemini.adapter'
import { AdventurePackRepository } from '@/infrastructure/supabase/adventure-pack-repository'
import { getCurrentUserServer, createSupabaseServerClient } from '@/infrastructure/supabase/auth-server'

/**
 * POST /api/pack/[id]/regenerate-mission
 *
 * Regenera una misión individual de un pack guardado.
 *
 * Body:
 * {
 *   "missionOrder": number,  // Orden de la misión a regenerar (1, 2, 3, etc.)
 *   "feedback": string?      // Feedback opcional del usuario
 * }
 *
 * Response:
 * {
 *   "ok": true,
 *   "mission": GeneratedAdventurePackMission
 * }
 *
 * Errors:
 * - 401: No autenticado
 * - 403: No tiene permisos para editar este pack
 * - 404: Pack o misión no encontrada
 * - 500: Error interno del servidor
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Verificar autenticación
    const user = await getCurrentUserServer()
    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'No autenticado. Por favor, inicia sesión.' },
        { status: 401 }
      )
    }

    // 2. Extraer parámetros de la URL
    const { id: packId } = await params

    // 3. Parsear body
    const body = await request.json()
    const { missionOrder, feedback } = body

    if (!missionOrder || typeof missionOrder !== 'number') {
      return NextResponse.json(
        { ok: false, error: 'missionOrder es requerido y debe ser un número' },
        { status: 400 }
      )
    }

    // 4. Inicializar dependencias
    const missionEditor = new GeminiAdapter()
    const supabaseServer = await createSupabaseServerClient()
    const repository = new AdventurePackRepository(supabaseServer)

    // 5. Ejecutar caso de uso
    const regeneratedMission = await regenerateMission(
      packId,
      user.id,
      missionOrder,
      feedback,
      missionEditor,
      repository,
      'es' // TODO: Obtener locale del usuario o request
    )

    // 6. Retornar éxito
    return NextResponse.json({
      ok: true,
      mission: regeneratedMission,
    })
  } catch (error) {
    console.error('[regenerate-mission] Error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'

    // Manejo de errores específicos
    if (errorMessage.includes('no encontrado') || errorMessage.includes('no existe')) {
      return NextResponse.json(
        { ok: false, error: errorMessage },
        { status: 404 }
      )
    }

    if (errorMessage.includes('No tienes permiso')) {
      return NextResponse.json(
        { ok: false, error: errorMessage },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { ok: false, error: `Error al regenerar misión: ${errorMessage}` },
      { status: 500 }
    )
  }
}
