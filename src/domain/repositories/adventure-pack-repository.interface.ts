// src/domain/repositories/adventure-pack-repository.interface.ts

import type { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'
import type { SavedAdventurePack } from '@/domain/saved-adventure-pack'

/**
 * Interfaz del repositorio de Adventure Packs.
 *
 * Define el contrato para persistencia de aventuras sin acoplar
 * el dominio a ninguna implementación concreta (Supabase, etc.)
 */
export interface IAdventurePackRepository {
  /**
   * Guarda un nuevo pack de aventura vinculado a un usuario.
   */
  save(params: {
    userId: string
    title: string
    pack: GeneratedAdventurePack
  }): Promise<SavedAdventurePack>

  /**
   * Obtiene un pack por su ID.
   */
  getById(id: string): Promise<SavedAdventurePack | null>

  /**
   * Lista todos los packs de un usuario.
   */
  listByUserId(userId: string): Promise<SavedAdventurePack[]>

  /**
   * Actualiza el contenido JSON de un pack existente.
   */
  updatePackJson(id: string, pack: GeneratedAdventurePack): Promise<SavedAdventurePack>

  /**
   * Elimina un pack verificando permisos de usuario.
   */
  deleteById(id: string, userId: string): Promise<boolean>
}
