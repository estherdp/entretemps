// src/app/api/pack/[id]/route.ts

import { NextResponse } from 'next/server'
import { deleteMyAdventurePack } from '@/application/delete-my-adventure-pack'
import { AdventurePackRepository } from '@/infrastructure/supabase/adventure-pack-repository'
import { getCurrentUser } from '@/infrastructure/supabase/auth'

/**
 * API Route para eliminar una aventura del usuario.
 *
 * DELETE /api/pack/[id]
 *
 * Seguridad:
 * - Requiere autenticación (usuario logueado)
 * - Solo puede eliminar sus propias aventuras
 * - Valida ownership antes de eliminar
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Obtener usuario autenticado
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json(
        { ok: false, error: 'No autenticado. Debes iniciar sesión.' },
        { status: 401 }
      )
    }

    // Obtener ID del pack de los parámetros
    const packId = params.id

    if (!packId) {
      return NextResponse.json(
        { ok: false, error: 'ID del pack no proporcionado' },
        { status: 400 }
      )
    }

    // Ejecutar caso de uso
    const repository = new AdventurePackRepository()
    const result = await deleteMyAdventurePack(
      {
        packId,
        userId: user.id,
      },
      repository
    )

    if (!result.ok) {
      // Determinar código de error apropiado
      const statusCode = result.error?.includes('no encontrado')
        ? 404
        : result.error?.includes('permisos')
          ? 403
          : 500

      return NextResponse.json({ ok: false, error: result.error }, { status: statusCode })
    }

    return NextResponse.json({
      ok: true,
      message: 'Aventura eliminada correctamente',
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
    console.error('[DELETE pack API] Error:', error)

    return NextResponse.json(
      { ok: false, error: `Error al eliminar la aventura: ${errorMessage}` },
      { status: 500 }
    )
  }
}
