// src/infrastructure/supabase/generation-usage-repository.ts

import type { SupabaseClient } from '@supabase/supabase-js'
import type { GenerationKind, IGenerationUsageRepository } from '@/domain/repositories'

/**
 * Implementación de IGenerationUsageRepository usando Supabase.
 *
 * Requiere la tabla `ai_generations` (ver supabase-ai-generations-setup.sql).
 * Debe recibir el cliente de servidor con la sesión del usuario para que
 * se apliquen las políticas RLS.
 */
export class GenerationUsageRepository implements IGenerationUsageRepository {
  constructor(private readonly client: SupabaseClient) {}

  async countSince(userId: string, kind: GenerationKind, since: Date): Promise<number> {
    const { count, error } = await this.client
      .from('ai_generations')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('kind', kind)
      .gte('created_at', since.toISOString())

    if (error) {
      throw new Error(`Error al consultar la cuota de generaciones: ${error.message}`)
    }

    return count ?? 0
  }

  async record(userId: string, kind: GenerationKind): Promise<void> {
    const { error } = await this.client.from('ai_generations').insert({ user_id: userId, kind })

    if (error) {
      throw new Error(`Error al registrar la generación: ${error.message}`)
    }
  }
}
