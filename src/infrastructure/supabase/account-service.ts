// src/infrastructure/supabase/account-service.ts

import type { SupabaseClient } from '@supabase/supabase-js'
import type { IAccountService } from '@/domain/services'
import { supabase } from './supabase-client'

/**
 * Implementación de IAccountService usando Supabase Auth.
 *
 * - El nombre se guarda en los metadatos del usuario (sin tablas extra).
 * - El borrado usa la función `delete_my_account` (ver supabase-account-deletion.sql),
 *   que borra los datos del usuario y su fila en auth.users.
 */
export class SupabaseAccountService implements IAccountService {
  constructor(private readonly client: SupabaseClient = supabase) {}

  async updateDisplayName(displayName: string): Promise<void> {
    const { error } = await this.client.auth.updateUser({ data: { display_name: displayName } })

    if (error) {
      throw new Error(`Error al guardar el nombre: ${error.message}`)
    }
  }

  async deleteAccount(): Promise<void> {
    const { error } = await this.client.rpc('delete_my_account')

    if (error) {
      throw new Error(`Error al borrar la cuenta: ${error.message}`)
    }

    // La sesión local ya no es válida: se limpia sin llamar al servidor.
    await this.client.auth.signOut({ scope: 'local' })
  }
}
