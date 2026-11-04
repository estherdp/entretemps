// src/app/api/me/usage/route.ts

import { NextResponse } from 'next/server'
import { getGenerationUsage, parseQuotaLimit } from '@/application/generation-quota'
import { GenerationUsageRepository } from '@/infrastructure/supabase/generation-usage-repository'
import { getCurrentUserServer, createSupabaseServerClient } from '@/infrastructure/supabase/auth-server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/me/usage
 *
 * Devuelve cuántas generaciones de IA ha usado el usuario en las últimas 24h.
 * Va en el servidor porque los límites son configuración privada.
 */
export async function GET() {
  const user = await getCurrentUserServer()
  if (!user) {
    return NextResponse.json({ ok: false, error: 'No autenticado' }, { status: 401 })
  }

  try {
    const usage = await getGenerationUsage(
      user.id,
      {
        adventure: parseQuotaLimit(process.env.DAILY_ADVENTURE_LIMIT, 5),
        mission: parseQuotaLimit(process.env.DAILY_MISSION_LIMIT, 20),
      },
      new GenerationUsageRepository(await createSupabaseServerClient())
    )

    return NextResponse.json({ ok: true, usage })
  } catch (error) {
    console.error('[me/usage] Error:', error)
    return NextResponse.json({ ok: false, error: 'No se pudo consultar el uso' }, { status: 500 })
  }
}
