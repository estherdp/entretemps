// src/domain/repositories/template-repository.interface.ts

import type { GeneratedAdventurePack } from '@/domain/generated-adventure-pack'

/**
 * Catálogo de aventuras de ejemplo, listas para jugar sin generar nada.
 *
 * Es síncrono porque el catálogo actual es estático (un JSON incluido en la
 * app). Si mañana viniera de una base de datos o un CMS, bastaría con otra
 * implementación de esta interfaz.
 */
export interface ITemplateRepository {
  /** Todas las plantillas, en el orden en que deben mostrarse. */
  list(): GeneratedAdventurePack[]

  /** Una plantilla por su id, o null si no existe. */
  getById(id: string): GeneratedAdventurePack | null
}
