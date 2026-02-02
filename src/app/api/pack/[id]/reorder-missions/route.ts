// src/app/api/pack/[id]/reorder-missions/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { reorderMissions } from '@/application/reorder-missions'
import { AdventurePackRepository } from '@/infrastructure/supabase/adventure-pack-repository'
import { getCurrentUserServer, createSupabaseServerClient } from '@/infrastructure/supabase/auth-server'

/**
 * POST /api/pack/[id]/reorder-missions
 *
 * Reordena las misiones de un pack guardado.
 *
 * Body:
 * {
 *   "newOrder": number[]  // Array con los orders de las misiones en el nuevo orden
 *                         // Ejemplo: [3, 1, 2] significa que la misión 3 va primero, etc.
 * }
 *
 * Response:
 * {
 *   "ok": true,
 *   "missions": GeneratedAdventurePackMission[]
 * }
 *
 * Errors:
 * - 401: No autenticado
 * - 403: No tiene permisos para editar este pack
 * - 404: Pack no encontrado
 * - 400: Orden inválido
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
        { ok: false, error: 'No autenticado' },
        { status: 401 }
      )
    }

    // 2. Extraer parámetros de la URL
    const { id: packId } = await params

    // 3. Parsear body
    const body = await request.json()
    const { newOrder } = body

    if (!Array.isArray(newOrder)) {
      return NextResponse.json(
        { ok: false, error: 'newOrder debe ser un array de números' },
        { status: 400 }
      )
    }

    if (newOrder.some((order) => typeof order !== 'number')) {
      return NextResponse.json(
        { ok: false, error: 'Todos los elementos de newOrder deben ser números' },
        { status: 400 }
      )
    }

    // 4. Inicializar dependencias
    const supabaseServer = await createSupabaseServerClient()
    const repository = new AdventurePackRepository(supabaseServer)

    // 5. Ejecutar caso de uso
    const reorderedMissions = await reorderMissions(
      packId,
      user.id,
      newOrder,
      repository
    )

    // 6. Retornar éxito
    return NextResponse.json({
      ok: true,
      missions: reorderedMissions,
    })
  } catch (error) {
    console.error('[reorder-missions] Error:', error)

    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'

    // Manejo de errores específicos
    if (errorMessage.includes('no encontrado')) {
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

    if (errorMessage.includes('inválido') || errorMessage.includes('duplicadas')) {
      return NextResponse.json(
        { ok: false, error: errorMessage },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { ok: false, error: `Error al reordenar misiones: ${errorMessage}` },
      { status: 500 }
    )
  }
}
