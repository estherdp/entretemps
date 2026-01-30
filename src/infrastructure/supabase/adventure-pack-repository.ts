import { supabase } from './supabase-client'
import { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'
import { SavedAdventurePack } from '@/domain/saved-adventure-pack'

export interface SaveAdventurePackParams {
  userId: string
  title: string
  pack: GeneratedAdventurePack
}

export class AdventurePackRepository {
  async save(params: SaveAdventurePackParams): Promise<SavedAdventurePack> {
    const { data, error } = await supabase
      .from('adventure_packs')
      .insert({
        user_id: params.userId,
        title: params.title,
        pack: params.pack,
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Error al guardar el pack: ${error.message}`)
    }

    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      pack: data.pack,
      createdAt: data.created_at,
    }
  }

  async listByUserId(userId: string): Promise<SavedAdventurePack[]> {
    const { data, error } = await supabase
      .from('adventure_packs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Error al listar los packs: ${error.message}`)
    }

    return data.map((row) => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      pack: row.pack,
      createdAt: row.created_at,
    }))
  }

  async getById(id: string): Promise<SavedAdventurePack | null> {
    const { data, error } = await supabase
      .from('adventure_packs')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(`Error al obtener el pack: ${error.message}`)
    }

    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      pack: data.pack,
      createdAt: data.created_at,
    }
  }

  async updatePackJson(
    id: string,
    pack: GeneratedAdventurePack
  ): Promise<SavedAdventurePack> {
    // First, update the pack without trying to select
    const { error: updateError } = await supabase
      .from('adventure_packs')
      .update({
        pack: pack,
        title: pack.title,
      })
      .eq('id', id)

    if (updateError) {
      throw new Error(`Error al actualizar el pack: ${updateError.message}`)
    }

    // Then fetch the updated pack separately
    const updatedPack = await this.getById(id)

    if (!updatedPack) {
      throw new Error('No se pudo obtener el pack actualizado')
    }

    return updatedPack
  }

  async deleteById(id: string, userId: string): Promise<boolean> {
    console.log('[Repository] deleteById - Iniciando eliminación', { id, userId })

    // Verificar que el pack pertenece al usuario antes de eliminar
    const pack = await this.getById(id)
    console.log('[Repository] Pack obtenido:', pack)

    if (!pack) {
      console.error('[Repository] Pack no encontrado')
      throw new Error('Pack no encontrado')
    }

    if (pack.userId !== userId) {
      console.error('[Repository] Usuario no es propietario', { packUserId: pack.userId, userId })
      throw new Error('No tienes permisos para eliminar este pack')
    }

    console.log('[Repository] Ejecutando DELETE en Supabase...')
    // Eliminar el pack (doble check con user_id en la query)
    const { error, data, count } = await supabase
      .from('adventure_packs')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      .select()

    console.log('[Repository] Resultado del DELETE:', { error, data, count })

    if (error) {
      console.error('[Repository] Error de Supabase:', error)
      throw new Error(`Error al eliminar el pack: ${error.message}`)
    }

    console.log('[Repository] Eliminación completada exitosamente')
    return true
  }
}
